import type { SceneSpec } from '../../types/scene.ts'
import { BLUE, GREEN, ORANGE, PURPLE } from '../colors.ts'

// Producer -> Topic (3 partitions) -> Consumer Group. The geometry IS the
// mental model: one producer fans into ordered partitions, which fan out to
// consumers. Animated edges show records "flowing" along the path.
export const kafkaTopics: SceneSpec = {
  id: 'kafka-topics',
  topic: 'apache-kafka',
  title: 'How a Kafka topic flows',
  subtitle: 'Producer → partitions → consumer group',
  grid: { cols: 5, rows: 5, gap: 0.3, padding: 0.5 },
  nodes: [
    { id: 'producer', label: 'Producer', cell: [0, 2], color: ORANGE, kind: 'symbol', sub: 'writes records' },

    { id: 'p0', label: 'Partition 0', cell: [2, 0], color: BLUE, kind: 'term' },
    { id: 'p1', label: 'Partition 1', cell: [2, 2], color: BLUE, kind: 'term' },
    { id: 'p2', label: 'Partition 2', cell: [2, 4], color: BLUE, kind: 'term' },

    { id: 'c0', label: 'Consumer A', cell: [4, 1], color: GREEN, kind: 'symbol' },
    { id: 'c1', label: 'Consumer B', cell: [4, 3], color: GREEN, kind: 'symbol' },

    { id: 'group', label: 'Consumer Group', cell: [4, 0, 1, 5], color: PURPLE, kind: 'term' },
  ],
  edges: [
    { from: 'producer', to: 'p0' },
    { from: 'producer', to: 'p1' },
    { from: 'producer', to: 'p2' },
    { from: 'p0', to: 'c0' },
    { from: 'p1', to: 'c0' },
    { from: 'p2', to: 'c1' },
  ],
  audio: '/content/apache-kafka/audio/kafka-topics.wav',
}
