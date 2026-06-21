import type { SceneNodeSpec, SceneSpec } from '../../types/scene.ts'
import { stack } from '../layout/patterns.ts'
import { BLUE, TEAL, GREEN, RED, GRAY } from '../colors.ts'

// Watermarking, drawn the same way as the windowing reel: a TIME AXIS. Every band
// shares ONE 25-column grid = minutes 12:00..12:25, so a clock time sits at the
// same x in all three. The watermark is then simply a BOUNDARY on that shared
// axis — its column (12:08 here) cuts straight down through the windows, the
// regions, and the late events, which is the whole intuition: left of the line is
// closed and dropped, right of it is still open and accepted.
//
// One worked example carries it. Latest event time seen = 12:18; allowed delay =
// 10 min; so watermark = 12:18 − 10 = 12:08 (column 8). Window W1 (ends 12:05) is
// fully behind the line → finalized & evicted. A late event at 12:11 is past the
// line → accepted into W3. A late event at 12:03 is behind the line → dropped.
//
// Hand-authored cells like spark-windowing (spans encode time); no flow edges —
// the diagram is spatial, the alignment across bands is the lesson.

const COLS = 25 // one column per minute, 12:00 -> 12:25
const WM = 8 // watermark column = 12:08

/** A bar on the shared time axis: starts at `col` (minutes past 12:00), `span` wide. */
const bar = (
  id: string,
  label: string,
  sub: string,
  color: string,
  col: number,
  span: number,
): SceneNodeSpec => ({ id, label, sub, color, kind: 'term', cell: [col, 0, span, 1] })

// The 5-min tumbling windows. W1 ends at 12:05, fully behind the watermark, so it
// is finalized and evicted; the rest are still open.
const windows: SceneNodeSpec = {
  id: 'wm-windows',
  label: 'Tumbling windows · 5 min',
  sub: 'a window closes once its end falls behind the watermark',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 1, gap: 0.12, padding: 0.3 },
  children: [
    bar('wm-w1', 'W1', '12:00–05 · emitted & evicted', GRAY, 0, 5),
    bar('wm-w2', 'W2', '12:05–10 · open', BLUE, 5, 5),
    bar('wm-w3', 'W3', '12:10–15 · open', BLUE, 10, 5),
    bar('wm-w4', 'W4', '12:15–20 · open', BLUE, 15, 5),
  ],
}

// The watermark itself, as the boundary between a closed region and an open one.
// The two bars meet exactly at column 8 — that seam IS the watermark line.
const watermark: SceneNodeSpec = {
  id: 'wm-line',
  label: 'Watermark = latest event 12:18 − delay 10 min = 12:08',
  sub: 'a line that only moves forward · withWatermark("ts", "10 min")',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 1, gap: 0.12, padding: 0.3 },
  children: [
    bar('wm-closed', '≤ 12:08', 'finalized & evicted — bounded memory', GRAY, 0, WM),
    bar('wm-open', '> 12:08 — still open', 'recent enough to still accept late data', TEAL, WM, COLS - WM),
  ],
}

// Two late events arriving now, on opposite sides of the line, plus the latest
// event that pins where the watermark sits (10 columns = the 10-min delay).
const events: SceneNodeSpec = {
  id: 'wm-events',
  label: 'A late event arrives — which side of the line?',
  sub: 'event time decides, not arrival time',
  kind: 'container',
  cell: [0, 0],
  layout: { cols: COLS, rows: 1, gap: 0.12, padding: 0.3 },
  children: [
    bar('wm-drop', 'event @ 12:03', 'behind watermark → dropped (too late)', RED, 1, 5),
    bar('wm-keep', 'event @ 12:11', 'past watermark → accepted into W3', GREEN, 9, 5),
    bar('wm-latest', 'latest 12:18', 'max event time seen so far', BLUE, 18, 3),
  ],
}

const layout = stack(
  [
    { node: windows, rows: 3 },
    { node: watermark, rows: 2 },
    { node: events, rows: 3 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const sparkWatermarking: SceneSpec = {
  id: 'spark-watermarking',
  topic: 'apache-spark',
  title: 'Watermarking',
  subtitle: 'late data, bounded state — the watermark line splits accepted from dropped',
  ...layout,
  edges: [],
}
