import type { SceneGrid, SceneNodeSpec } from '../../types/scene.ts'

// Layout-pattern helpers. Most reels are one of a few shapes — a pipeline, a
// fan-out, layered bands, or a hub with spokes. Hand-assigning `cell` for each
// shape is the slow, collision-prone part of authoring (the flat grid gives no
// structure, unlike NodeMap's nested resolver). These helpers own BOTH the grid
// sizing and the cells, so you describe the shape and get a non-overlapping,
// auto-centered placement back. Spread the result into a SceneSpec:
//
//   const layout = columns([[producer], partitions, consumers])
//   export const scene: SceneSpec = { id, topic, title, ...layout, edges }
//
// `cell` is computed for you; everything else on a node you still author. For
// container-based nesting (see spark-execution.ts) hand-author cells instead.

/** A node minus its `cell` — the helper fills that in. */
export type NodeSeed = Omit<SceneNodeSpec, 'cell'>

export interface PatternResult {
  grid: SceneGrid
  nodes: SceneNodeSpec[]
}

export interface PatternOpts {
  /** Override grid gap (grid units). */
  gap?: number
  /** Override grid padding (grid units). */
  padding?: number
}

function withCell(seed: NodeSeed, cell: SceneNodeSpec['cell']): SceneNodeSpec {
  return { ...seed, cell }
}

// In this app a node fills its cell, so nodes must stay 1×1 to read as compact
// chips — spanning to "center" would balloon them. Instead we lay nodes on a
// sparse grid with an empty lane between every node and every stage, and center
// a short stage by leaving empty leading rows. With N items a track needs
// 2N-1 cells (item, gap, item, …); a stage of k items inside `len` cells starts
// at `(len - (2k-1)) / 2` (always integer: both terms are odd, so the gap is
// even). This reproduces a clean hand-authored layout exactly.
const trackLen = (count: number) => Math.max(2 * count - 1, 1)
const startOffset = (len: number, count: number) => (len - (2 * count - 1)) / 2

/**
 * Multi-column flow, left → right (e.g. producer → partitions → consumers).
 * Each inner array is one column laid out top-to-bottom. Stages sit in alternate
 * columns (gap lanes between them) and shorter stages are vertically centered,
 * so every node stays a compact 1×1 chip and nothing overlaps.
 */
export function columns(stages: NodeSeed[][], opts: PatternOpts = {}): PatternResult {
  const maxCount = Math.max(...stages.map((s) => s.length), 1)
  const cols = trackLen(stages.length)
  const rows = trackLen(maxCount)
  const nodes = stages.flatMap((stage, s) => {
    const offset = startOffset(rows, stage.length)
    return stage.map((seed, i) => withCell(seed, [2 * s, offset + 2 * i]))
  })
  return { grid: { cols, rows, ...opts }, nodes }
}

/**
 * Multi-row flow, top → bottom — the transpose of `columns`. Each inner array
 * is one horizontal band (e.g. inputs band, then a transform band, then
 * outputs), bands sit in alternate rows and shorter bands are centered.
 */
export function rows(bands: NodeSeed[][], opts: PatternOpts = {}): PatternResult {
  const maxCount = Math.max(...bands.map((b) => b.length), 1)
  const rows = trackLen(bands.length)
  const cols = trackLen(maxCount)
  const nodes = bands.flatMap((band, r) => {
    const offset = startOffset(cols, band.length)
    return band.map((seed, i) => withCell(seed, [offset + 2 * i, 2 * r]))
  })
  return { grid: { cols, rows, ...opts }, nodes }
}

/** A single straight line of nodes. `vertical` (default) stacks top→bottom. */
export function pipeline(
  seeds: NodeSeed[],
  axis: 'vertical' | 'horizontal' = 'vertical',
  opts: PatternOpts = {},
): PatternResult {
  return axis === 'vertical'
    ? rows(seeds.map((s) => [s]), opts)
    : columns(seeds.map((s) => [s]), opts)
}

/**
 * One source feeding many targets. `horizontal` (default) puts the source on
 * the left and fans right; `vertical` puts it on top and fans down.
 */
export function fanOut(
  source: NodeSeed,
  targets: NodeSeed[],
  axis: 'horizontal' | 'vertical' = 'horizontal',
  opts: PatternOpts = {},
): PatternResult {
  return axis === 'horizontal'
    ? columns([[source], targets], opts)
    : rows([[source], targets], opts)
}

/**
 * A central hub ringed by up to 8 spokes on a 3×3 grid (hub in the middle,
 * spokes filling the perimeter clockwise from top). For >8 spokes, hand-author.
 */
export function hubSpoke(
  hub: NodeSeed,
  spokes: NodeSeed[],
  opts: PatternOpts = {},
): PatternResult {
  // Perimeter cells of a 3×3 grid, clockwise from top-center.
  const ring: Array<[number, number]> = [
    [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0],
  ]
  if (spokes.length > ring.length) {
    console.warn(`[layout] hubSpoke supports ${ring.length} spokes, got ${spokes.length}`)
  }
  const nodes: SceneNodeSpec[] = [
    withCell(hub, [1, 1]),
    ...spokes.slice(0, ring.length).map((seed, i) => withCell(seed, [ring[i][0], ring[i][1]])),
  ]
  return { grid: { cols: 3, rows: 3, ...opts }, nodes }
}

/** Title/colour metadata for a `container` (or just `id` for a `group`). */
export interface ContainerMeta {
  id: string
  label: string
  color?: string
  sub?: string
}

/** Inner spacing for a wrapper's child grid (overrides the content grid's). */
export type WrapOpts = Pick<PatternOpts, 'gap' | 'padding'>

/**
 * Wrap a helper result as a titled `container` node: its `children` are laid out
 * INSIDE the container's box (the resolver reserves a title band on top), so
 * containment is exact. The returned node has no real `cell` yet — `stack` (or a
 * parent's `children`) places it. Nest by passing a `stack`/`container` result
 * as the content.
 */
export function container(
  meta: ContainerMeta,
  content: PatternResult,
  opts: WrapOpts = {},
): SceneNodeSpec {
  return {
    ...meta,
    kind: 'container',
    cell: [0, 0],
    layout: { ...content.grid, ...opts },
    children: content.nodes,
  }
}

/** Like `container`, but an invisible wrapper (no border/label) — sub-arranges. */
export function group(id: string, content: PatternResult, opts: WrapOpts = {}): SceneNodeSpec {
  return {
    id,
    label: '',
    kind: 'group',
    cell: [0, 0],
    layout: { ...content.grid, ...opts },
    children: content.nodes,
  }
}

/** One band of a vertical `stack`. */
export interface StackBand {
  /** A leaf seed, or a `container()`/`group()` result. */
  node: NodeSeed
  /** Vertical row-span — proportional height of this band. Default 1. */
  rows?: number
}

/**
 * Vertically arrange nodes into ONE grid (the scene root, or a wrapper's
 * content). Wrapper bands (`container`/`group`) fill the width so their nested
 * children have room; leaf bands are centered at one column. `rows` per band
 * sets proportional heights. Returns a `PatternResult`, so it nests: wrap a
 * `stack` in a `container` to get DAG ⊃ Stage ⊃ Task.
 */
export function stack(bands: StackBand[], opts: PatternOpts & { cols?: number } = {}): PatternResult {
  const { cols = 3, ...gridOpts } = opts
  const center = Math.floor((cols - 1) / 2)
  const nodes: SceneNodeSpec[] = []
  let row = 0
  for (const { node, rows: span = 1 } of bands) {
    const fills = node.kind === 'container' || node.kind === 'group'
    const cell: SceneNodeSpec['cell'] = fills ? [0, row, cols, span] : [center, row, 1, span]
    nodes.push({ ...node, cell })
    row += span
  }
  return { grid: { cols, rows: row, ...gridOpts }, nodes }
}
