import type { SceneNodeSpec, SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, TEAL } from '../colors.ts'

// Deep-dive on caching — the Cache vs Persist box from the master map, plus the
// executor memory model that explains WHY it works the way it does. You cache()
// or persist() a DataFrame at a chosen storage level; the blocks land in the
// Storage half of Spark's unified memory region. The memory map is the lesson:
// Unified (60%) is shared between Execution and Storage, so cached blocks can be
// evicted when a shuffle needs the room — which is why a storage level that can
// spill to disk is safer than memory-only.

// The verbs: cache() == persist(MEMORY_ONLY); unpersist() releases it.
const api = section(
  { id: 'cp-api', label: 'Cache vs Persist', color: PURPLE, sub: 'keep a DataFrame around' },
  [
    [{ id: 'cp-cache', label: 'cache' }],
    [{ id: 'cp-persist', label: 'persist' }],
    [{ id: 'cp-unpersist', label: 'unpersist' }],
  ],
  { padding: 0.18 },
)

// Storage levels: trade memory vs disk vs serialized vs replicated.
const levels = section(
  { id: 'cp-levels', label: 'Storage levels', color: BLUE, sub: 'memory · disk · serialize' },
  [
    [{ id: 'cp-memonly', label: 'MEMORY_ONLY' }],
    [{ id: 'cp-memonlyser', label: 'MEMORY_ONLY_SER' }],
    [{ id: 'cp-memdisk', label: 'MEMORY_AND_DISK' }],
    [{ id: 'cp-memdisk2', label: 'MEMORY_AND_DISK_2' }],
  ],
  { padding: 0.18 },
)

// The executor heap, drawn to proportion: top 60% is the Unified region (split
// 50/50 between Execution and Storage), bottom 40% is User Memory. Hand-authored
// cells because the spans encode the percentages.
const memory: SceneNodeSpec = {
  id: 'mem-executor',
  label: 'Executor JVM Memory',
  sub: 'where cached blocks live',
  color: TEAL,
  kind: 'container',
  cell: [0, 0],
  layout: { cols: 1, rows: 10, gap: 0.15, padding: 0.22 },
  children: [
    {
      id: 'mem-unified',
      label: 'Spark Memory · Unified · 60%',
      sub: 'execution + storage share this, and borrow from each other',
      color: BLUE,
      kind: 'container',
      cell: [0, 0, 1, 6],
      layout: { cols: 2, rows: 1, gap: 0.15, padding: 0.18 },
      children: [
        {
          id: 'mem-exec',
          label: 'Execution · 50%',
          sub: 'shuffles · joins · sorts',
          color: ORANGE,
          kind: 'term',
          cell: [0, 0],
        },
        {
          id: 'mem-storage',
          label: 'Storage · 50%',
          sub: 'cached blocks · broadcast',
          color: GREEN,
          kind: 'term',
          cell: [1, 0],
        },
      ],
    },
    {
      id: 'mem-user',
      label: 'User Memory · 40%',
      sub: 'your objects · UDFs · metadata',
      color: PURPLE,
      kind: 'term',
      cell: [0, 6, 1, 4],
    },
  ],
}

// API ∥ levels on top, the proportional memory block below.
const config = group('cp-config', columns([[api], [levels]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: config, rows: 4 },
    { node: memory, rows: 8 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkCachePersist: SceneSpec = {
  id: 'spark-cache-persist',
  topic: 'apache-spark',
  title: 'Caching & Spark memory',
  subtitle: 'cache · persist · storage levels · the memory model',
  ...layout,
  edges: [
    { from: 'cp-api', to: 'cp-levels' },
    { from: 'cp-levels', to: 'mem-storage' },
  ],
}
