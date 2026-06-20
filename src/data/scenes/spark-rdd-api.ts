import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// Deep-dive on the RDD API — Spark's original, low-level core (the "RDD API" box
// from the master map, expanded). Shape mirrors that box: you CREATE an RDD,
// then TRANSFORM it (narrow ops stay on a partition, wide ops shuffle; pair-RDD
// ops work on key/value data), then an ACTION triggers the whole lazy chain.
// Built with section() so every sub-box shares the series grammar; the two
// transform/keyed bands sit 2-up to use the width and keep the scene readable.

// Create an RDD: from an in-memory collection or from text files.
const creation = section(
  { id: 'rdd-create', label: 'Create', color: RED, sub: 'get an RDD' },
  [
    [
      { id: 'rdd-parallelize', label: 'parallelize' },
      { id: 'rdd-textfile', label: 'textFile' },
    ],
    [
      { id: 'rdd-wholetext', label: 'wholeTextFiles' },
      { id: 'rdd-numslices', label: 'numSlices' },
    ],
  ],
  { padding: 0.2 },
)

// Narrow transformations: each output partition reads one input partition — no
// data crosses the network, so they're cheap and pipelined. One chip per row so
// labels stay legible inside the narrow 3-up column.
const narrow = section(
  { id: 'rdd-narrow', label: 'Narrow', color: GREEN, sub: 'no shuffle' },
  [
    [{ id: 'rdd-map', label: 'map' }],
    [{ id: 'rdd-mappart', label: 'mapPartitions' }],
    [{ id: 'rdd-flatmap', label: 'flatMap' }],
    [{ id: 'rdd-filter', label: 'filter' }],
    [{ id: 'rdd-repartition', label: 'repartition' }],
    [{ id: 'rdd-coalesce', label: 'coalesce' }],
  ],
  { padding: 0.18 },
)

// Wide transformations: output partitions pull from many input partitions, so
// Spark must shuffle data across the cluster — the expensive ones.
const wide = section(
  { id: 'rdd-wide', label: 'Wide', color: TEAL, sub: 'shuffle' },
  [
    [{ id: 'rdd-union', label: 'union' }],
    [{ id: 'rdd-distinct', label: 'distinct' }],
    [{ id: 'rdd-intersection', label: 'intersection' }],
    [{ id: 'rdd-sortby', label: 'sortBy' }],
    [{ id: 'rdd-subtract', label: 'subtract' }],
    [{ id: 'rdd-join', label: 'join' }],
    [{ id: 'rdd-cartesian', label: 'cartesian' }],
    [{ id: 'rdd-cogroup', label: 'cogroup' }],
  ],
  { padding: 0.18 },
)

// Pair RDDs: key/value data unlocks the byKey family — grouping and reducing
// per key (almost all of these shuffle).
const pair = section(
  { id: 'rdd-pair', label: 'Pair RDD · byKey', color: PURPLE, sub: 'key / value' },
  [
    [{ id: 'rdd-maptopair', label: 'mapToPair' }],
    [{ id: 'rdd-reducebykey', label: 'reduceByKey' }],
    [{ id: 'rdd-groupbykey', label: 'groupByKey' }],
    [{ id: 'rdd-aggbykey', label: 'aggregateByKey' }],
    [{ id: 'rdd-foldbykey', label: 'foldByKey' }],
    [{ id: 'rdd-combinebykey', label: 'combineByKey' }],
    [{ id: 'rdd-countbykey', label: 'countByKey' }],
    [{ id: 'rdd-samplebykey', label: 'sampleByKey' }],
  ],
  { padding: 0.18 },
)

// Actions: nothing runs until one of these pulls a result back to the driver or
// writes it out. Full-width band, grouped by what they do: results to driver,
// reductions, then I/O + shared-state helpers.
const actions = section(
  { id: 'rdd-actions', label: 'Actions · Misc', color: ORANGE, sub: 'trigger the job' },
  [
    [
      { id: 'rdd-collect', label: 'collect' },
      { id: 'rdd-count', label: 'count' },
      { id: 'rdd-take', label: 'take' },
      { id: 'rdd-first', label: 'first' },
    ],
    [
      { id: 'rdd-reduce', label: 'reduce' },
      { id: 'rdd-fold', label: 'fold' },
      { id: 'rdd-aggregate', label: 'aggregate' },
    ],
    [
      { id: 'rdd-savetext', label: 'saveAsTextFile' },
      { id: 'rdd-broadcast', label: 'broadcast' },
      { id: 'rdd-accumulator', label: 'accumulator' },
    ],
  ],
  { padding: 0.18 },
)

// The three transform categories sit abreast (Narrow ∥ Wide ∥ Pair); Actions is
// its own full-width band below, since an action is what fires the lazy chain.
const transforms = group('rdd-transforms', columns([[narrow], [wide], [pair]], { tight: true }), {
  padding: 0,
})

const layout = stack(
  [
    { node: creation, rows: 2 },
    { node: transforms, rows: 7 },
    { node: actions, rows: 3 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkRddApi: SceneSpec = {
  id: 'spark-rdd-api',
  topic: 'apache-spark',
  title: 'RDD API — Spark’s low-level core',
  subtitle: 'create → transform (narrow / wide / pair) → act',
  ...layout,
  edges: [
    { from: 'rdd-create', to: 'rdd-narrow' },
    { from: 'rdd-create', to: 'rdd-wide' },
    { from: 'rdd-create', to: 'rdd-pair' },
    { from: 'rdd-narrow', to: 'rdd-actions' },
    { from: 'rdd-wide', to: 'rdd-actions' },
    { from: 'rdd-pair', to: 'rdd-actions' },
  ],
}
