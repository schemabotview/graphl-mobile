import type { SceneSpec } from '../../types/scene.ts'
import { columns, container, group, rows, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// The full path one Spark query takes, top-down: Driver → Catalyst (its four
// plans side-by-side) → Tungsten → DAG (⊃ Stages ⊃ Tasks) → Task Scheduler →
// Cluster Manager → Executors. Geometry IS the lesson — stacked = sequential,
// side-by-side = parallel.
//
// Built with REAL nesting (../layout/patterns.ts + the recursive resolver):
// `container()` wraps content so its children are measured INSIDE its box, and
// `stack()` arranges the bands vertically. The DAG's two-level nesting
// (DAG ⊃ Stage ⊃ Task) is a `stack` of stage containers wrapped as the DAG's
// content. Inner positions are exact because every child lives in its parent's
// sub-grid, not the scene grid.

// Catalyst's four optimizer plans, side-by-side inside its box.
const catalyst = container(
  { id: 'catalyst', label: 'Catalyst Optimizer', color: PURPLE },
  rows(
    [[
      { id: 'ulp', label: 'Unresolved', color: BLUE, kind: 'term' },
      { id: 'logical', label: 'Logical', color: BLUE, kind: 'term' },
      { id: 'optimized', label: 'Optimized', color: BLUE, kind: 'term' },
      { id: 'physical', label: 'Physical', color: BLUE, kind: 'term' },
    ]],
    { tight: true },
  ),
  { padding: 0.2 },
)

// A stage = two parallel tasks stacked vertically inside its own box.
const stage = (id: string, label: string) =>
  container(
    { id, label, color: TEAL },
    columns([[
      { id: `${id}t1`, label: 'Task', color: RED, kind: 'term' },
      { id: `${id}t2`, label: 'Task', color: RED, kind: 'term' },
    ]]),
    { padding: 0.25 },
  )

// DAG ⊃ Stages ⊃ Tasks: the two stages sit side-by-side inside the DAG box.
const dag = container(
  { id: 'dag', label: 'DAG Scheduler', color: ORANGE, sub: 'the job, split into stages' },
  rows([[stage('stage1', 'Stage 1'), stage('stage2', 'Stage 2')]]),
  { padding: 0.12 },
)

// Two executors run the dispatched tasks in parallel.
const executors = group(
  'executors',
  columns([
    [{ id: 'ex1', label: 'Executor', color: GREEN, kind: 'symbol', sub: 'runs tasks in parallel' }],
    [{ id: 'ex2', label: 'Executor', color: GREEN, kind: 'symbol', sub: 'runs tasks in parallel' }],
  ]),
  { padding: 0.15 },
)

const layout = stack(
  [
    { node: { id: 'driver', label: 'Driver', color: ORANGE, kind: 'symbol', sub: 'runs your code' } },
    { node: catalyst, rows: 2 },
    { node: { id: 'tungsten', label: 'Tungsten', color: PURPLE, kind: 'symbol', sub: 'code gen + memory' } },
    { node: dag, rows: 4 },
    { node: { id: 'tasksched', label: 'Task Scheduler', color: ORANGE, kind: 'term', sub: 'dispatches tasks' } },
    { node: { id: 'cluster', label: 'Cluster Manager', color: PURPLE, kind: 'symbol', sub: 'allocates executors' } },
    { node: executors, rows: 2 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkExecution: SceneSpec = {
  id: 'spark-execution',
  topic: 'apache-spark',
  title: "Spark's batch processing",
  subtitle: 'Driver → Catalyst → Tungsten → DAG → executors',
  ...layout,
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
