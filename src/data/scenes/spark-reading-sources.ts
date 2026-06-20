import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// Deep-dive on getting data IN — the Input Sources + Read API boxes from the
// master map. Data lives in many sources; spark.read pulls it in, and four sets
// of knobs control how: FORMAT OPTIONS parse it, BAD-RECORD MODE decides what to
// do with garbage rows, MULTI-FILE LOOKUP picks which files, and JDBC PARALLEL
// READS split a database table across executors. Sources at the top feed two
// lanes of read concerns.

// Where data lives — the formats and systems spark.read can pull from.
const sources = section(
  { id: 'rd-sources', label: 'Input Sources', color: BLUE, sub: 'read from anything' },
  [
    [
      { id: 'rd-csv', label: 'CSV' },
      { id: 'rd-parquet', label: 'Parquet' },
      { id: 'rd-json', label: 'JSON' },
      { id: 'rd-orc', label: 'ORC' },
    ],
    [
      { id: 'rd-jdbc', label: 'JDBC' },
      { id: 'rd-hive', label: 'Hive' },
      { id: 'rd-files', label: 'Files' },
      { id: 'rd-delta', label: 'Delta' },
    ],
  ],
  { padding: 0.18 },
)

// How to parse the bytes — mostly for text formats like CSV/JSON.
const format = section(
  { id: 'rd-format', label: 'Format options', color: TEAL, sub: 'parse the bytes' },
  [
    [
      { id: 'rd-header', label: 'header' },
      { id: 'rd-sep', label: 'sep' },
    ],
    [
      { id: 'rd-mergeschema', label: 'mergeSchema' },
      { id: 'rd-multiline', label: 'multiLine' },
    ],
  ],
  { padding: 0.18 },
)

// What to do with rows that don't parse — the difference between a silent
// corrupt column and a hard failure.
const badRecord = section(
  { id: 'rd-badrecord', label: 'Bad-record mode()', color: RED, sub: 'handle garbage rows' },
  [
    [{ id: 'rd-permissive', label: 'permissive' }],
    [{ id: 'rd-failfast', label: 'failFast' }],
    [{ id: 'rd-dropmalformed', label: 'dropMalformed' }],
    [{ id: 'rd-corruptcol', label: 'columnNameOfCorrupt' }],
    [{ id: 'rd-badpath', label: 'badRecordsPath' }],
  ],
  { padding: 0.18 },
)

// Which files to pull in when a path points at many.
const multiFile = section(
  { id: 'rd-multifile', label: 'Multi-file lookup', color: PURPLE, sub: 'pick the files' },
  [
    [{ id: 'rd-glob', label: 'glob' }],
    [{ id: 'rd-regex', label: 'regex' }],
    [{ id: 'rd-multipaths', label: 'multiple paths' }],
    [{ id: 'rd-recursive', label: 'recursiveFileLookup' }],
  ],
  { padding: 0.18 },
)

// Split a JDBC table across executors so the read isn't single-threaded.
const jdbc = section(
  { id: 'rd-jdbcreads', label: 'JDBC parallel reads', color: ORANGE, sub: 'parallelize a table' },
  [
    [{ id: 'rd-partcol', label: 'partitionColumn' }],
    [{ id: 'rd-lower', label: 'lowerBound' }],
    [{ id: 'rd-upper', label: 'upperBound' }],
    [{ id: 'rd-numpart', label: 'numPartitions' }],
    [{ id: 'rd-fetchsize', label: 'fetchSize' }],
  ],
  { padding: 0.18 },
)

// Two lanes of read concerns under the sources: parse/validate on the left,
// file-selection/parallelism on the right.
const knobsTop = group('rd-knobs-top', columns([[format], [badRecord]], { tight: true }), { padding: 0 })
const knobsBot = group('rd-knobs-bot', columns([[multiFile], [jdbc]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: sources, rows: 3 },
    { node: knobsTop, rows: 5 },
    { node: knobsBot, rows: 5 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkReadingSources: SceneSpec = {
  id: 'spark-reading-sources',
  topic: 'apache-spark',
  title: 'Reading data — spark.read',
  subtitle: 'sources → format · bad-record · multi-file · JDBC',
  ...layout,
  edges: [
    { from: 'rd-sources', to: 'rd-format' },
    { from: 'rd-sources', to: 'rd-badrecord' },
    { from: 'rd-format', to: 'rd-multifile' },
    { from: 'rd-badrecord', to: 'rd-jdbcreads' },
  ],
}
