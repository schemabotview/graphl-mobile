import type { SceneGrid, SceneNodeSpec } from '../../types/scene.ts'

// Ported from NodeMap's `resolve()` (src/data/layout.ts). NodeMap emits
// centered 3D positions for Three.js; here we emit top-left pixel boxes
// because React Flow positions nodes by their top-left corner.

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Resolve each node's `cell` against the scene grid and a pixel canvas,
 * returning an id -> Box map (top-left origin) for React Flow.
 */
export function resolveGrid(
  nodes: SceneNodeSpec[],
  grid: SceneGrid,
  canvas: { width: number; height: number },
): Record<string, Box> {
  const { cols, rows, gap = 0.2, padding = 0.4 } = grid

  // Convert relative gap/padding (grid units) into pixels using one cell as
  // the unit, so spacing scales with the canvas.
  const cellW = canvas.width / (cols + 2 * padding + (cols - 1) * gap)
  const cellH = canvas.height / (rows + 2 * padding + (rows - 1) * gap)
  const gapX = cellW * gap
  const gapY = cellH * gap
  const padX = cellW * padding
  const padY = cellH * padding

  const out: Record<string, Box> = {}
  for (const node of nodes) {
    const [c, r, cs = 1, rs = 1] = node.cell
    out[node.id] = {
      x: padX + c * (cellW + gapX),
      y: padY + r * (cellH + gapY),
      w: cs * cellW + (cs - 1) * gapX,
      h: rs * cellH + (rs - 1) * gapY,
    }
  }
  return out
}
