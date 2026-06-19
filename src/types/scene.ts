// The SceneSpec is the authoring contract for one reel/scene. It is the exact
// shape an AI generator will emit later (Phase 6), so keep it declarative and
// free of rendering concerns. Nodes are placed on a grid by `cell` coordinates
// (NodeMap convention); the layout engine resolves cells -> pixel positions.

export type NodeKind = 'symbol' | 'term'

export interface SceneNodeSpec {
  id: string
  label: string
  /** [col, row, colSpan?, rowSpan?] within the scene's grid. */
  cell: [number, number, number?, number?]
  color?: string
  /** 'term' = filled chip whose text IS the concept; 'symbol' = labelled node. */
  kind?: NodeKind
  /** Optional smaller caption under the label. */
  sub?: string
}

export interface SceneEdgeSpec {
  from: string
  to: string
  label?: string
  color?: string
  /** Animate "flow in path" along this edge. Defaults to true. */
  animated?: boolean
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
  /** Path to narration audio, e.g. /content/apache-kafka/audio/topics.wav */
  audio?: string
}
