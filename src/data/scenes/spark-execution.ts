import type { SceneSpec } from '../../types/scene.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// The full path one Spark query takes, top-down. The Driver hands the query to
// the Catalyst optimizer, whose four plans (unresolved → logical → optimized →
// physical) sit side-by-side inside its box; Tungsten then generates bytecode.
// The DAG scheduler decomposes the job into the classic hierarchy — a job holds
// sequential stages, and each stage holds parallel tasks — drawn as nested
// boxes: DAG ⊃ Stage ⊃ Task. That logical work is then dispatched down the
// physical path: Task Scheduler → Cluster Manager → Executors.
//
// Nesting is achieved with 'container' nodes: a container is listed BEFORE the
// nodes that sit inside it so React Flow paints the children on top. Geometry
// IS the lesson — stacked = sequential (stages), side-by-side = parallel
// (Catalyst's plans, a stage's tasks, the executors).
export const sparkExecution: SceneSpec = {
  id: 'spark-execution',
  topic: 'apache-spark',
  title: "Spark's batch processing",
  subtitle: 'Driver → Catalyst → Tungsten → DAG → executors',
  grid: { cols: 4, rows: 12, gap: 0.3, padding: 0.5 },
  nodes: [
    { id: 'driver', label: 'Driver', cell: [1, 0, 2, 1], color: ORANGE, kind: 'symbol', sub: 'runs your code' },

    { id: 'catalyst', label: 'Catalyst Optimizer', cell: [0, 1, 4, 2], color: PURPLE, kind: 'container' },
    { id: 'ulp', label: 'Unresolved', cell: [0, 2], color: BLUE, kind: 'term' },
    { id: 'logical', label: 'Logical', cell: [1, 2], color: BLUE, kind: 'term' },
    { id: 'optimized', label: 'Optimized', cell: [2, 2], color: BLUE, kind: 'term' },
    { id: 'physical', label: 'Physical', cell: [3, 2], color: BLUE, kind: 'term' },

    { id: 'tungsten', label: 'Tungsten', cell: [1, 3, 2, 1], color: PURPLE, kind: 'symbol', sub: 'code gen + memory' },

    // DAG ⊃ Stages ⊃ Tasks. Each container precedes its children in this list.
    { id: 'dag', label: 'DAG Scheduler', cell: [0, 4, 4, 5], color: ORANGE, kind: 'container', sub: 'the job, split into stages' },

    { id: 'stage1', label: 'Stage 1', cell: [0, 5, 4, 2], color: TEAL, kind: 'container' },
    { id: 's1t1', label: 'Task', cell: [0, 6, 2, 1], color: RED, kind: 'term' },
    { id: 's1t2', label: 'Task', cell: [2, 6, 2, 1], color: RED, kind: 'term' },

    { id: 'stage2', label: 'Stage 2', cell: [0, 7, 4, 2], color: TEAL, kind: 'container' },
    { id: 's2t1', label: 'Task', cell: [0, 8, 2, 1], color: RED, kind: 'term' },
    { id: 's2t2', label: 'Task', cell: [2, 8, 2, 1], color: RED, kind: 'term' },

    { id: 'tasksched', label: 'Task Scheduler', cell: [1, 9, 2, 1], color: ORANGE, kind: 'term', sub: 'dispatches tasks' },
    { id: 'cluster', label: 'Cluster Manager', cell: [1, 10, 2, 1], color: PURPLE, kind: 'symbol', sub: 'allocates executors' },
    { id: 'ex1', label: 'Executor', cell: [0, 11, 2, 1], color: GREEN, kind: 'symbol', sub: 'runs tasks in parallel' },
    { id: 'ex2', label: 'Executor', cell: [2, 11, 2, 1], color: GREEN, kind: 'symbol', sub: 'runs tasks in parallel' },
  ],
  edges: [
    { from: 'driver', to: 'catalyst' },
    { from: 'catalyst', to: 'tungsten' },
    { from: 'tungsten', to: 'dag' },
    { from: 'stage1', to: 'stage2' },
    { from: 'dag', to: 'tasksched' },
    { from: 'tasksched', to: 'cluster' },
    { from: 'cluster', to: 'ex1' },
    { from: 'cluster', to: 'ex2' },
  ],
  // audio stem defaults to id -> schemabotview/apache-spark-reels/audio/spark-execution.wav
}
