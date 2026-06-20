import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, RED } from '../colors.ts'

// Deep-dive on performance — the Performance Tuning, Shuffle, and Broadcast joins
// boxes from the master map, unified by their common enemy: the SHUFFLE. Wide
// operations move data across the network, and that's almost always the slowest
// part of a job. The three lever boxes hang off that one cost: PARTITIONING
// controls how data is divided, SHUFFLE CONFIG controls how the shuffle runs,
// and BROADCAST JOINS skip the shuffle entirely for a small table.

// The cost center every lever below is fighting.
const shuffle = {
  id: 'pt-shuffle',
  label: 'The Shuffle',
  color: RED,
  kind: 'symbol' as const,
  sub: 'wide ops move data across the network — Spark’s #1 cost',
}

// Control how many partitions you have and where rows land.
const partitioning = section(
  { id: 'pt-partitioning', label: 'Partitioning', color: BLUE, sub: 'control the split' },
  [
    [{ id: 'pt-repartition', label: 'repartition', sub: 'full shuffle · ↑ or ↓' }],
    [{ id: 'pt-coalesce', label: 'coalesce', sub: 'merge · no shuffle · ↓ only' }],
    [{ id: 'pt-partitionby', label: 'partitionBy', sub: 'folders on write' }],
  ],
  { padding: 0.18 },
)

// Tune how the shuffle itself runs.
const shuffleConf = section(
  { id: 'pt-shuffleconf', label: 'Shuffle config', color: ORANGE, sub: 'how it runs' },
  [
    [{ id: 'pt-smj', label: 'sortMergeJoin', sub: 'default big-table join' }],
    [{ id: 'pt-shufparts', label: 'shuffle partitions', sub: 'default 200 — tune it' }],
  ],
  { padding: 0.18 },
)

// Avoid the shuffle outright when one side is small.
const broadcast = section(
  { id: 'pt-broadcast', label: 'Broadcast joins', color: GREEN, sub: 'skip the shuffle' },
  [
    [{ id: 'pt-broadcastdf', label: 'broadcast(df)', sub: 'ship the small side' }],
    [{ id: 'pt-autobroadcast', label: 'autoBroadcastJoin', sub: 'auto when < 10 MB' }],
  ],
  { padding: 0.18 },
)

// Three levers abreast, all hanging off the shuffle above them.
const levers = group(
  'pt-levers',
  columns([[partitioning], [shuffleConf], [broadcast]], { tight: true }),
  { padding: 0 },
)

const layout = stack(
  [
    { node: shuffle, rows: 2 },
    { node: levers, rows: 5 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkPerformanceTuning: SceneSpec = {
  id: 'spark-performance-tuning',
  topic: 'apache-spark',
  title: 'Performance tuning — taming the shuffle',
  subtitle: 'partitioning · shuffle config · broadcast joins',
  ...layout,
  edges: [
    { from: 'pt-shuffle', to: 'pt-partitioning' },
    { from: 'pt-shuffle', to: 'pt-shuffleconf' },
    { from: 'pt-shuffle', to: 'pt-broadcast' },
  ],
}
