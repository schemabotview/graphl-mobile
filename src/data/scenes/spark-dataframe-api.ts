import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// Deep-dive on the DataFrame API — the workhorse you'll reach for most (the
// "DataFrame API" box from the master map, expanded). It's the biggest box, so
// the sub-boxes pair up 2-up to use the width. Flow: CREATE a DataFrame and
// REFERENCE its columns, then TRANSFORM it (with built-in FUNCTIONS, JOINS, and
// AGGREGATIONS), then an ACTION pulls a result or persists it. Because Spark
// knows the schema, all of this compiles down to an optimized plan.

// Get a DataFrame: from a schema + rows, from SQL, or from a source.
const create = section(
  { id: 'df-create', label: 'Create + Schema', color: ORANGE, sub: 'get a DataFrame' },
  [
    [{ id: 'df-structtype', label: 'StructType' }],
    [{ id: 'df-ddl', label: 'DDL string' }],
    [{ id: 'df-createdf', label: 'createDataFrame' }],
    [{ id: 'df-sql', label: 'spark.sql()' }],
    [{ id: 'df-read', label: 'spark.read' }],
  ],
  { padding: 0.18 },
)

// Five ways to point at a column — string, col(), expr(), attribute, index.
const columnRefs = section(
  { id: 'df-colref', label: 'Column refs', color: BLUE, sub: 'name a column' },
  [
    [{ id: 'df-colname', label: '"name"' }],
    [{ id: 'df-col', label: 'col("n")' }],
    [{ id: 'df-expr', label: 'expr("…")' }],
    [{ id: 'df-dfcol', label: 'df.col("n")' }],
    [{ id: 'df-dfindex', label: 'df["n"]' }],
  ],
  { padding: 0.18 },
)

// The core verbs: shape columns, filter rows, handle nulls, branch with when.
// 12 verbs in 3 even rows (distinct is just dropDuplicates() with no subset).
const transforms = section(
  { id: 'df-transforms', label: 'Transformations + when', color: GREEN, sub: 'reshape the data' },
  [
    [
      { id: 'df-select', label: 'select' },
      { id: 'df-selectexpr', label: 'selectExpr' },
      { id: 'df-withcolumn', label: 'withColumn' },
      { id: 'df-withrenamed', label: 'withColumnRenamed' },
    ],
    [
      { id: 'df-drop', label: 'drop' },
      { id: 'df-filter', label: 'filter / where' },
      { id: 'df-orderby', label: 'orderBy / sort' },
      { id: 'df-dropdupes', label: 'dropDuplicates' },
    ],
    [
      { id: 'df-cast', label: 'cast' },
      { id: 'df-nadrop', label: 'na.drop' },
      { id: 'df-nafill', label: 'na.fill' },
      { id: 'df-when', label: 'when / otherwise' },
    ],
  ],
  { padding: 0.16 },
)

// pyspark.sql.functions — the library you call inside select/withColumn.
const functions = section(
  { id: 'df-functions', label: 'pyspark.sql.functions', color: PURPLE, sub: 'column expressions' },
  [
    [{ id: 'df-strfns', label: 'string fns' }],
    [{ id: 'df-datefns', label: 'date / time fns' }],
    [{ id: 'df-arrayfns', label: 'array fns' }],
    [{ id: 'df-udf', label: 'UDF / pandas_udf' }],
  ],
  { padding: 0.18 },
)

// Combine two DataFrames — by matching keys (joins) or by set algebra.
const joins = section(
  { id: 'df-joins', label: 'Joins + Set ops', color: TEAL, sub: 'combine DataFrames' },
  [
    [
      { id: 'df-inner', label: 'inner' },
      { id: 'df-left', label: 'left' },
    ],
    [
      { id: 'df-right', label: 'right' },
      { id: 'df-outer', label: 'outer' },
    ],
    [
      { id: 'df-semianti', label: 'semi / anti' },
      { id: 'df-cross', label: 'cross' },
    ],
    [
      { id: 'df-union', label: 'union' },
      { id: 'df-intersect', label: 'intersect' },
    ],
  ],
  { padding: 0.18 },
)

// Roll many rows up into summaries — group, pivot, and window functions. Full
// width now, so two rows of four rather than the half-width 2-up pairs.
const aggregations = section(
  { id: 'df-aggs', label: 'Aggregations', color: RED, sub: 'group + window' },
  [
    [
      { id: 'df-groupby', label: 'groupBy' },
      { id: 'df-agg', label: 'agg' },
      { id: 'df-countdistinct', label: 'countDistinct' },
      { id: 'df-rollupcube', label: 'rollup / cube' },
    ],
    [
      { id: 'df-pivot', label: 'pivot' },
      { id: 'df-stackmelt', label: 'stack / melt' },
      { id: 'df-window', label: 'Window.over' },
      { id: 'df-rank', label: 'rank / row_num' },
    ],
  ],
  { padding: 0.18 },
)

// Actions trigger the job; persistence + explore round out the workflow. Own
// full-width band at the bottom, grouped by role: trigger, persist, inspect.
const actions = section(
  { id: 'df-actions', label: 'Actions · Persist · Explore', color: ORANGE, sub: 'trigger + inspect' },
  [
    [
      { id: 'df-collect', label: 'collect' },
      { id: 'df-count', label: 'count' },
      { id: 'df-show', label: 'show' },
      { id: 'df-take', label: 'take' },
    ],
    [
      { id: 'df-cache', label: 'cache' },
      { id: 'df-persist', label: 'persist' },
    ],
    [
      { id: 'df-printschema', label: 'printSchema' },
      { id: 'df-describe', label: 'describe' },
      { id: 'df-sample', label: 'sample' },
      { id: 'df-sampleby', label: 'sampleBy' },
    ],
  ],
  { padding: 0.18 },
)

// 2-up bands keep the upper boxes readable: create ∥ column-refs, then the wide
// transforms band, then functions ∥ joins. Aggregations and Actions each get
// their own full-width band at the bottom.
const setup = group('df-setup', columns([[create], [columnRefs]], { tight: true }), { padding: 0 })
const augment = group('df-augment', columns([[functions], [joins]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: setup, rows: 5 },
    { node: transforms, rows: 4 },
    { node: augment, rows: 5 },
    { node: aggregations, rows: 3 },
    { node: actions, rows: 4 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkDataframeApi: SceneSpec = {
  id: 'spark-dataframe-api',
  topic: 'apache-spark',
  title: 'DataFrame API — the workhorse',
  subtitle: 'create → transform (functions / joins / aggregations) → act',
  ...layout,
  edges: [
    { from: 'df-create', to: 'df-transforms' },
    { from: 'df-colref', to: 'df-transforms' },
    { from: 'df-transforms', to: 'df-functions' },
    { from: 'df-transforms', to: 'df-joins' },
    { from: 'df-functions', to: 'df-aggs' },
    { from: 'df-joins', to: 'df-aggs' },
    { from: 'df-aggs', to: 'df-actions' },
  ],
}
