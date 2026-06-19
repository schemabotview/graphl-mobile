import type { SceneSpec } from '../../types/scene.ts'
import { BLUE, GREEN, ORANGE, RED } from '../colors.ts'

// Driver builds a DAG, splits it into stages, schedules tasks onto executors.
// Top-down flow mirrors how Spark lowers a job from logical plan to physical
// work on the cluster.
export const sparkExecution: SceneSpec = {
  id: 'spark-execution',
  topic: 'apache-spark',
  title: "Spark's execution model",
  subtitle: 'Driver → DAG → stages → tasks → executors',
  grid: { cols: 3, rows: 5, gap: 0.35, padding: 0.5 },
  nodes: [
    { id: 'driver', label: 'Driver', cell: [1, 0], color: ORANGE, kind: 'symbol', sub: 'builds the plan' },
    { id: 'dag', label: 'DAG', cell: [1, 1], color: RED, kind: 'term', sub: 'logical plan' },
    { id: 'stage1', label: 'Stage 1', cell: [0, 2], color: BLUE, kind: 'term' },
    { id: 'stage2', label: 'Stage 2', cell: [2, 2], color: BLUE, kind: 'term' },
    { id: 'tasks', label: 'Tasks', cell: [1, 3], color: BLUE, kind: 'term', sub: 'one per partition' },
    { id: 'ex1', label: 'Executor', cell: [0, 4], color: GREEN, kind: 'symbol' },
    { id: 'ex2', label: 'Executor', cell: [2, 4], color: GREEN, kind: 'symbol' },
  ],
  edges: [
    { from: 'driver', to: 'dag' },
    { from: 'dag', to: 'stage1' },
    { from: 'dag', to: 'stage2' },
    { from: 'stage1', to: 'tasks' },
    { from: 'stage2', to: 'tasks' },
    { from: 'tasks', to: 'ex1' },
    { from: 'tasks', to: 'ex2' },
  ],
  audio: '/content/apache-spark/audio/spark-execution.wav',
}
