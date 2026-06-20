import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// Deep-dive on the SQL API — the same engine as DataFrames, but you talk to it
// in plain SQL (the "SQL API" box from the master map, expanded). Flow: REGISTER
// a DataFrame as a view so you can name it, write a QUERY with the usual clauses,
// then JOIN / set-combine and AGGREGATE, reaching for FUNCTIONS and NULL
// semantics inside expressions. DataFrame code and SQL compile to the same plan,
// so this is a style choice, not a speed one.

// Register a DataFrame as a named table/view; inspect what's registered.
const views = section(
  { id: 'sql-views', label: 'Views + Catalog', color: GREEN, sub: 'name a table' },
  [
    [
      { id: 'sql-tempview', label: 'createTempView' },
      { id: 'sql-globalview', label: 'createGlobalTempView' },
      { id: 'sql-saveastable', label: 'saveAsTable' },
    ],
    [
      { id: 'sql-listtables', label: 'catalog.listTables' },
      { id: 'sql-listcolumns', label: 'catalog.listColumns' },
    ],
  ],
  { padding: 0.18 },
)

// The clauses of a single SELECT, in the order they're written.
const queries = section(
  { id: 'sql-queries', label: 'Queries', color: BLUE, sub: 'the SELECT clauses' },
  [
    [
      { id: 'sql-select', label: 'SELECT' },
      { id: 'sql-from', label: 'FROM' },
      { id: 'sql-where', label: 'WHERE' },
      { id: 'sql-groupby', label: 'GROUP BY' },
    ],
    [
      { id: 'sql-having', label: 'HAVING' },
      { id: 'sql-orderby', label: 'ORDER BY' },
      { id: 'sql-limit', label: 'LIMIT' },
      { id: 'sql-offset', label: 'OFFSET' },
    ],
  ],
  { padding: 0.18 },
)

// Combine tables: join types, set algebra, CTEs and subqueries.
const joins = section(
  { id: 'sql-joins', label: 'Joins + Sets + CTE', color: ORANGE, sub: 'combine tables' },
  [
    [
      { id: 'sql-innerjoin', label: 'INNER JOIN' },
      { id: 'sql-leftjoin', label: 'LEFT JOIN' },
    ],
    [
      { id: 'sql-fulljoin', label: 'FULL JOIN' },
      { id: 'sql-semianti', label: 'SEMI / ANTI' },
    ],
    [
      { id: 'sql-union', label: 'UNION' },
      { id: 'sql-intersect', label: 'INTERSECT' },
    ],
    [
      { id: 'sql-cte', label: 'WITH (CTE)' },
      { id: 'sql-subquery', label: 'subquery' },
    ],
  ],
  { padding: 0.18 },
)

// Aggregate functions and the window/ranking family.
const aggs = section(
  { id: 'sql-aggs', label: 'Aggregates + Window', color: PURPLE, sub: 'summarize + rank' },
  [
    [
      { id: 'sql-avg', label: 'AVG' },
      { id: 'sql-sum', label: 'SUM' },
    ],
    [
      { id: 'sql-minmax', label: 'MIN / MAX' },
      { id: 'sql-count', label: 'COUNT' },
    ],
    [
      { id: 'sql-rownumber', label: 'ROW_NUMBER' },
      { id: 'sql-rank', label: 'RANK' },
    ],
    [
      { id: 'sql-laglead', label: 'LAG / LEAD' },
      { id: 'sql-cumedist', label: 'CUME_DIST' },
    ],
  ],
  { padding: 0.18 },
)

// The built-in scalar functions you call inside expressions.
const functions = section(
  { id: 'sql-functions', label: 'Functions', color: TEAL, sub: 'scalar expressions' },
  [
    [
      { id: 'sql-mathfns', label: 'abs / ceil / floor' },
      { id: 'sql-roundfns', label: 'round / sqrt / log' },
    ],
    [
      { id: 'sql-strfns', label: 'concat / substring' },
      { id: 'sql-casefns', label: 'upper / lower / trim' },
    ],
    [
      { id: 'sql-datefns', label: 'current_date / ts' },
      { id: 'sql-dateadd', label: 'date_add / format' },
    ],
    [
      { id: 'sql-arraycontains', label: 'array_contains' },
      { id: 'sql-arraysort', label: 'array_sort / union' },
    ],
  ],
  { padding: 0.18 },
)

// How SQL treats NULL — the gotchas that trip people up.
const nullsem = section(
  { id: 'sql-null', label: 'Null semantics', color: RED, sub: 'how NULL behaves' },
  [
    [
      { id: 'sql-eq', label: '=' },
      { id: 'sql-nulleq', label: '<=>' },
      { id: 'sql-isnull', label: 'IS NULL' },
      { id: 'sql-coalesce', label: 'COALESCE' },
      { id: 'sql-nullif', label: 'NULLIF' },
    ],
  ],
  { padding: 0.18 },
)

// Joins ∥ Aggregates share a band; everything else is a full-width band.
const combine = group('sql-combine', columns([[joins], [aggs]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: views, rows: 3 },
    { node: queries, rows: 3 },
    { node: combine, rows: 5 },
    { node: functions, rows: 4 },
    { node: nullsem, rows: 2 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkSqlApi: SceneSpec = {
  id: 'spark-sql-api',
  topic: 'apache-spark',
  title: 'SQL API — Spark in plain SQL',
  subtitle: 'register a view → SELECT → join · aggregate · functions',
  ...layout,
  edges: [
    { from: 'sql-views', to: 'sql-queries' },
    { from: 'sql-queries', to: 'sql-joins' },
    { from: 'sql-queries', to: 'sql-aggs' },
    { from: 'sql-joins', to: 'sql-functions' },
    { from: 'sql-aggs', to: 'sql-functions' },
    { from: 'sql-functions', to: 'sql-null' },
  ],
}
