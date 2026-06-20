import type { SceneNodeSpec, SceneSpec } from '../../types/scene.ts'
import { stack } from '../layout/patterns.ts'
import { BLUE, ORANGE, GREEN, PURPLE, TEAL } from '../colors.ts'

// Event-time windowing, drawn as a time axis (the only way the three shapes
// actually read). Every band shares ONE 25-column grid = minutes 12:00..12:25,
// so a given clock time sits at the same x in all three — that alignment is what
// makes tumbling vs sliding vs session legible at a glance. A bar's colSpan IS
// its duration; its starting column IS its event time. Hand-authored cells (like
// the executor memory model in spark-cache-persist) because the spans encode time.
//
// No flow edges here: windowing is spatial, not a pipeline. The overlap (sliding)
// and the gaps (session) are the lesson, so the diagram is positional and the
// entrance reveal carries the animation. Bars cycle palette colors so adjacent
// and overlapping windows stay distinguishable (readability over family-accent).

const COLS = 25 // one column per minute, 12:00 -> 12:25
const PALETTE = [BLUE, ORANGE, GREEN, PURPLE, TEAL]

/** A colored window bar: starts at `col` (minutes past 12:00), `span` minutes wide. */
const bar = (
  id: string,
  label: string,
  sub: string,
  i: number,
  col: number,
  span: number,
  row = 0,
): SceneNodeSpec => ({
  id,
  label,
  sub,
  color: PALETTE[i % PALETTE.length],
  kind: 'term',
  cell: [col, row, span, 1],
})

// Fixed size, back-to-back — every event lands in exactly one window.
const tumbling: SceneNodeSpec = {
  id: 'win-tumbling',
  label: 'Tumbling · 5 min',
  sub: 'fixed size, no overlap — each event in exactly one window',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 1, gap: 0.12, padding: 0.3 },
  children: [
    bar('win-t1', 'W1', '12:00–05', 0, 0, 5),
    bar('win-t2', 'W2', '12:05–10', 1, 5, 5),
    bar('win-t3', 'W3', '12:10–15', 2, 10, 5),
    bar('win-t4', 'W4', '12:15–20', 3, 15, 5),
    bar('win-t5', 'W5', '12:20–25', 4, 20, 5),
  ],
}

// Fixed size but advancing by the slide interval — windows overlap, so one event
// falls in multiple windows. Stacked rows make the overlap visible.
const sliding: SceneNodeSpec = {
  id: 'win-sliding',
  label: 'Sliding · 10 min, slide 5 min',
  sub: 'overlap — one event falls in multiple windows',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 4, gap: 0.12, padding: 0.3 },
  children: [
    bar('win-s1', 'W1', '12:00–10', 0, 0, 10, 0),
    bar('win-s2', 'W2', '12:05–15', 1, 5, 10, 1),
    bar('win-s3', 'W3', '12:10–20', 2, 10, 10, 2),
    bar('win-s4', 'W4', '12:15–25', 3, 15, 10, 3),
  ],
}

// Dynamic size — a window grows while events keep arriving and closes after a
// gap of inactivity. Empty columns between bars render the quiet gaps.
const session: SceneNodeSpec = {
  id: 'win-session',
  label: 'Session · 5 min gap',
  sub: 'dynamic — grows with activity, closes after a quiet gap',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 1, gap: 0.12, padding: 0.3 },
  children: [
    bar('win-g1', 'W1', 'events 12:04, 12:09 → closes 12:09+5 = 12:14', 0, 4, 10),
    bar('win-g2', 'W2', '12:15 → closes 12:15+5 = 12:20', 1, 15, 5),
    bar('win-g3', 'W3', '12:22 → active', 2, 22, 3),
  ],
}

const layout = stack(
  [
    { node: tumbling, rows: 3 },
    { node: sliding, rows: 6 },
    { node: session, rows: 3 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const sparkWindowing: SceneSpec = {
  id: 'spark-windowing',
  topic: 'apache-spark',
  title: 'Event-time windows',
  subtitle: 'tumbling · sliding · session — bucket a stream by event time',
  ...layout,
  edges: [],
}
