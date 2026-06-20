import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED } from '../colors.ts'

// The map of the whole Spark batch API, top-down — the "table of contents" reel
// the per-API deep-dives hang off. Geometry IS the lesson: the vertical spine is
// the dataflow (Input → Read → process → Write → Output); the four processing
// APIs sit SIDE-BY-SIDE because they're interchangeable lenses over the same
// engine, not sequential steps. Colors match the reference diagram and stay
// consistent across the series (blue=read, red=RDD, orange=DataFrame, green=SQL,
// blue=pandas, green=write, purple=cross-cutting).

// The four interchangeable processing APIs, shown abreast (pick one per job).
const apis = group(
  'apis',
  columns(
    [
      [{ id: 'rdd', label: 'RDD API', color: RED, kind: 'symbol', sub: 'low-level' }],
      [{ id: 'dataframe', label: 'DataFrame API', color: ORANGE, kind: 'symbol', sub: 'typed columns' }],
      [{ id: 'sql', label: 'SQL API', color: GREEN, kind: 'symbol', sub: 'queries + views' }],
      [{ id: 'pandas', label: 'pandas API', color: BLUE, kind: 'symbol', sub: 'pandas on Spark' }],
    ],
    { tight: true },
  ),
  { padding: 0.15 },
)

// Concerns that apply across every API, not a step in the flow — kept off-spine.
const crossCutting = section(
  { id: 'crosscut', label: 'Cross-cutting', color: PURPLE, sub: 'applies across all APIs' },
  [
    [
      { id: 'cc-cache', label: 'Cache / Persist' },
      { id: 'cc-shuffle', label: 'Shuffle' },
    ],
    [
      { id: 'cc-perf', label: 'Perf Tuning' },
      { id: 'cc-broadcast', label: 'Broadcast joins' },
    ],
  ],
  { padding: 0.2 },
)

const layout = stack(
  [
    { node: { id: 'input', label: 'Input Sources', color: BLUE, kind: 'symbol', sub: 'CSV · Parquet · JSON · JDBC · Delta' } },
    { node: { id: 'read', label: 'Read API', color: BLUE, kind: 'symbol', sub: 'spark.read' } },
    { node: apis, rows: 2 },
    { node: { id: 'write', label: 'Write API', color: GREEN, kind: 'symbol', sub: 'df.write' } },
    { node: { id: 'output', label: 'Output', color: GREEN, kind: 'symbol', sub: 'Files · Hive · JDBC · Delta' } },
    { node: crossCutting, rows: 2 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkApiStack: SceneSpec = {
  id: 'apache-spark-api-stack',
  topic: 'apache-spark',
  title: 'The Spark API stack',
  subtitle: 'Input → Read → RDD / DataFrame / SQL / pandas → Write → Output',
  ...layout,
  edges: [
    { from: 'input', to: 'read' },
    { from: 'read', to: 'rdd' },
    { from: 'read', to: 'dataframe' },
    { from: 'read', to: 'sql' },
    { from: 'read', to: 'pandas' },
    { from: 'rdd', to: 'write' },
    { from: 'dataframe', to: 'write' },
    { from: 'sql', to: 'write' },
    { from: 'pandas', to: 'write' },
    { from: 'write', to: 'output' },
  ],
}
