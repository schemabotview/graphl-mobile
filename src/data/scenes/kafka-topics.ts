import type { SceneSpec } from '../../types/scene.ts'
import { columns } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE } from '../colors.ts'

// Producer -> Topic (3 partitions) -> Consumer Group. The geometry IS the
// mental model: one producer fans into ordered partitions, which fan out to
// consumers. Animated edges show records "flowing" along the path.
//
// Reference use of `columns()`: each inner array is one left-to-right stage, and
// the helper sizes the grid and centers every stage for you (the lone producer
// and the 2 consumers are auto-centered against the 3 partitions). The only
// hand-authored node is the "Consumer Group" backdrop — helpers own flat fans;
// a grouping box that wraps a column is composed in by hand, listed BEFORE the
// consumers so they paint on top of it.
const fan = columns(
  [
    [{ id: 'producer', label: 'Producer', color: ORANGE, kind: 'symbol', sub: 'writes records' }],
    [
      { id: 'p0', label: 'Partition 0', color: BLUE, kind: 'term' },
      { id: 'p1', label: 'Partition 1', color: BLUE, kind: 'term' },
      { id: 'p2', label: 'Partition 2', color: BLUE, kind: 'term' },
    ],
    [
      { id: 'c0', label: 'Consumer A', color: GREEN, kind: 'symbol' },
      { id: 'c1', label: 'Consumer B', color: GREEN, kind: 'symbol' },
    ],
  ],
  { gap: 0.3, padding: 0.5 },
)

export const kafkaTopics: SceneSpec = {
  id: 'kafka-topics',
  topic: 'apache-kafka',
  title: 'How a Kafka topic flows',
  subtitle: 'Producer → partitions → consumer group',
  grid: fan.grid,
  nodes: [
    // Backdrop wrapping the consumer column (the last stage → last grid column),
    // spanning its full height. Listed first so the consumers render on top of
    // it with the purple group frame showing around them.
    { id: 'group', label: 'Consumer Group', cell: [fan.grid.cols - 1, 0, 1, fan.grid.rows], color: PURPLE, kind: 'term' },
    ...fan.nodes,
  ],
  edges: [
    { from: 'producer', to: 'p0' },
    { from: 'producer', to: 'p1' },
    { from: 'producer', to: 'p2' },
    { from: 'p0', to: 'c0' },
    { from: 'p1', to: 'c0' },
    { from: 'p2', to: 'c1' },
  ],
  // audio stem defaults to id -> schemabotview/apache-kafka-reels/audio/kafka-topics.wav
}
