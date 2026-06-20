import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, TEAL } from '../colors.ts'

// Deep-dive on getting data OUT — the Write API + Output boxes from the master
// map, the mirror of the read reel. df.write is configured by FORMAT (how to
// encode), MODE (what to do if the target exists), and LAYOUT (how to physically
// organize the files), then a SINK method actually writes, landing the data in
// an OUTPUT destination. The config boxes funnel into the sink, which flows out.

// How to encode the bytes on the way out.
const format = section(
  { id: 'wr-format', label: 'Format', color: GREEN, sub: 'encode the bytes' },
  [
    [
      { id: 'wr-parquet', label: 'parquet' },
      { id: 'wr-csv', label: 'csv' },
    ],
    [
      { id: 'wr-json', label: 'json' },
      { id: 'wr-delta', label: 'delta' },
    ],
  ],
  { padding: 0.18 },
)

// What to do when the target already exists — the choice that prevents (or
// causes) accidental data loss.
const mode = section(
  { id: 'wr-mode', label: 'mode()', color: ORANGE, sub: 'if target exists' },
  [
    [
      { id: 'wr-overwrite', label: 'overwrite' },
      { id: 'wr-append', label: 'append' },
    ],
    [
      { id: 'wr-error', label: 'error' },
      { id: 'wr-ignore', label: 'ignore' },
    ],
  ],
  { padding: 0.18 },
)

// How files are physically organized — partitioning and bucketing for fast reads.
const lay = section(
  { id: 'wr-layout', label: 'Layout', color: TEAL, sub: 'organize the files' },
  [
    [{ id: 'wr-partitionby', label: 'partitionBy' }],
    [{ id: 'wr-bucketby', label: 'bucketBy' }],
    [{ id: 'wr-sortby', label: 'sortBy' }],
  ],
  { padding: 0.18 },
)

// The methods that actually trigger the write.
const sinks = section(
  { id: 'wr-sinks', label: 'Sinks', color: PURPLE, sub: 'write it out' },
  [
    [
      { id: 'wr-save', label: 'save' },
      { id: 'wr-saveastable', label: 'saveAsTable' },
    ],
    [
      { id: 'wr-jdbc', label: 'jdbc' },
      { id: 'wr-insertinto', label: 'insertInto' },
    ],
  ],
  { padding: 0.18 },
)

// Where the data lands.
const output = section(
  { id: 'wr-output', label: 'Output', color: BLUE, sub: 'where it lands' },
  [
    [
      { id: 'wr-files', label: 'Files' },
      { id: 'wr-hivetable', label: 'Hive table' },
      { id: 'wr-jdbctarget', label: 'JDBC target' },
      { id: 'wr-deltatable', label: 'Delta table' },
    ],
  ],
  { padding: 0.18 },
)

// Format ∥ mode on top, layout ∥ sinks below — all funnelling into the sink.
const config = group('wr-config', columns([[format], [mode]], { tight: true }), { padding: 0 })
const write = group('wr-write', columns([[lay], [sinks]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: config, rows: 3 },
    { node: write, rows: 4 },
    { node: output, rows: 2 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkWritingSinks: SceneSpec = {
  id: 'spark-writing-sinks',
  topic: 'apache-spark',
  title: 'Writing data — df.write',
  subtitle: 'format · mode · layout → sink → output',
  ...layout,
  edges: [
    { from: 'wr-format', to: 'wr-sinks' },
    { from: 'wr-mode', to: 'wr-sinks' },
    { from: 'wr-layout', to: 'wr-sinks' },
    { from: 'wr-sinks', to: 'wr-output' },
  ],
}
