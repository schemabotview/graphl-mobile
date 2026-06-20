import type { SceneSpec } from '../../types/scene.ts'
import { stack } from '../layout/patterns.ts'
import { GRAY, GREEN, ORANGE } from '../colors.ts'

// Structured Streaming, framed as the user's key insight: it's a BATCH job run in
// a loop. Each micro-batch is the same partition/executor model as batch (see
// spark-execution); streaming just wraps it with the four additions that make it
// continuous and fault-tolerant — offset tracking (what's new), a trigger (when
// to run), a state store (memory across batches), and a checkpoint (so a crash
// resumes exactly-once). The loop edge back to the offset tracker is the lesson.
//
// Full-width stacked boxes: stack({ cols: 1 }) makes each leaf fill the single
// column instead of centering as a narrow chip. Green = data-flow steps, gray =
// control steps, orange = the stateful step.

const layout = stack(
  [
    {
      node: {
        id: 'ss-offset',
        label: 'Offset tracker',
        color: GREEN,
        kind: 'symbol',
        sub: 'what’s new since the last checkpoint?',
      },
    },
    {
      node: {
        id: 'ss-trigger',
        label: 'Micro-batch trigger',
        color: GRAY,
        kind: 'symbol',
        sub: 'processingTime · availableNow · once',
      },
    },
    {
      node: {
        id: 'ss-process',
        label: 'Partition + process',
        color: GREEN,
        kind: 'symbol',
        sub: 'same executor model as batch',
      },
    },
    {
      node: {
        id: 'ss-state',
        label: 'State store · RocksDB',
        color: ORANGE,
        kind: 'symbol',
        sub: 'running counts · windows',
      },
    },
    {
      node: {
        id: 'ss-sink',
        label: 'Sink + output mode',
        color: GREEN,
        kind: 'symbol',
        sub: 'append · update · complete',
      },
    },
    {
      node: {
        id: 'ss-checkpoint',
        label: 'Checkpoint save',
        color: GRAY,
        kind: 'symbol',
        sub: 'offsets + WAL + state',
      },
    },
  ],
  { cols: 1, gap: 0.45, padding: 0.5 },
)

export const sparkStructuredStreaming: SceneSpec = {
  id: 'spark-structured-streaming',
  topic: 'apache-spark',
  title: 'Structured Streaming — batch in a loop',
  subtitle: 'offset · trigger · state · checkpoint, around a micro-batch',
  ...layout,
  edges: [
    { from: 'ss-offset', to: 'ss-trigger' },
    { from: 'ss-trigger', to: 'ss-process' },
    { from: 'ss-process', to: 'ss-state' },
    { from: 'ss-state', to: 'ss-sink' },
    { from: 'ss-sink', to: 'ss-checkpoint' },
    { from: 'ss-checkpoint', to: 'ss-offset', label: 'next micro-batch' },
  ],
}
