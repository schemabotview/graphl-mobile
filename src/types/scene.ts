// The SceneSpec is the authoring contract for one reel/scene. It is the exact
// shape an AI generator will emit later (Phase 6), so keep it declarative and
// free of rendering concerns. Nodes are placed on a grid by `cell` coordinates
// (NodeMap convention); the layout engine resolves cells -> pixel positions.

export type NodeKind = 'symbol' | 'term' | 'container' | 'group'

export interface SceneNodeSpec {
  id: string
  label: string
  /** [col, row, colSpan?, rowSpan?] within the PARENT's grid (scene grid at top level). */
  cell: [number, number, number?, number?]
  color?: string
  /**
   * 'term' = filled chip whose text IS the concept; 'symbol' = labelled node;
   * 'container' = titled box whose `children` are laid out INSIDE its box (a
   * title band is reserved at the top); 'group' = an invisible container (no
   * chrome/label) used only to sub-arrange its children.
   */
  kind?: NodeKind
  /** Optional smaller caption under the label. */
  sub?: string
  /**
   * Inner grid for this node's `children`. Children are resolved relative to
   * this node's pixel box (NodeMap-style nesting), so containment is exact.
   */
  layout?: SceneGrid
  /** Child nodes laid out inside this node's box via `layout`. */
  children?: SceneNodeSpec[]
}

export interface SceneEdgeSpec {
  from: string
  to: string
  label?: string
  color?: string
  /** Animate "flow in path" along this edge. Defaults to true. */
  animated?: boolean
  /**
   * Optional node-handle ids to route through (React Flow). Omit for normal
   * flow (uses the default top/bottom handles). Set both to 'r-source' /
   * 'r-target' for a loop/feedback edge that routes down the right side.
   */
  sourceHandle?: string
  targetHandle?: string
}

export interface SceneGrid {
  cols: number
  rows: number
  /** Gap between cells, in grid units (relative). Default 0.2. */
  gap?: number
  /** Inner padding, in grid units (relative). Default 0.4. */
  padding?: number
}

export interface SceneSpec {
  id: string
  /** 'apache-spark' | 'apache-kafka' | 'kotlin' | 'python' | ... */
  topic: string
  title: string
  subtitle?: string
  grid: SceneGrid
  nodes: SceneNodeSpec[]
  edges: SceneEdgeSpec[]
  /**
   * Narration stem within the `<topic>-reels` repo's audio/ folder. Resolved to
   * a raw GitHub URL by `audioUrl(topic, audio)`. Defaults to `id` when omitted.
   */
  audio?: string
}
