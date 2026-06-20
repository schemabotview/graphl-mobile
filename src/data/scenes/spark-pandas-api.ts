import type { SceneSpec } from '../../types/scene.ts'
import { columns, group, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE } from '../colors.ts'

// Deep-dive on the pandas API on Spark — write pandas code, run it across the
// cluster (the "pandas API on Spark (ps)" box from the master map, expanded).
// Flow: CREATE a ps DataFrame, TRANSFORM it with the pandas verbs you already
// know, then an ACTION writes out or converts back. INDEX STRATEGIES is the one
// genuinely new concept — how a single pandas-style index is faked across a
// distributed dataset — so it sits beside Actions, fed from the transforms.

// Get a pandas-on-Spark DataFrame: build one, read a file, or convert.
const create = section(
  { id: 'ps-create', label: 'Creation', color: BLUE, sub: 'get a ps DataFrame' },
  [
    [
      { id: 'ps-fromdict', label: 'ps.DataFrame(dict)' },
      { id: 'ps-read', label: 'read_csv/json/parquet' },
    ],
    [
      { id: 'ps-pandasapi', label: 'sdf.pandas_api()' },
      { id: 'ps-frompandas', label: 'ps.from_pandas(pdf)' },
    ],
  ],
  { padding: 0.18 },
)

// The familiar pandas verbs — they run distributed instead of on one machine.
const transforms = section(
  { id: 'ps-transforms', label: 'Transformations', color: GREEN, sub: 'pandas verbs' },
  [
    [
      { id: 'ps-select', label: 'select / asgn' },
      { id: 'ps-filter', label: 'filter / qry' },
      { id: 'ps-groupby', label: 'groupby / agg' },
    ],
    [
      { id: 'ps-rename', label: 'na / rename' },
      { id: 'ps-apply', label: 'apply / trans' },
      { id: 'ps-accessors', label: 'str / dt / num' },
    ],
  ],
  { padding: 0.18 },
)

// Actions: write back out, or collect to a real (single-machine) pandas frame.
const actions = section(
  { id: 'ps-actions', label: 'Actions', color: ORANGE, sub: 'write / convert' },
  [
    [{ id: 'ps-tocsv', label: 'to_csv' }],
    [{ id: 'ps-toparquet', label: 'to_parquet' }],
    [{ id: 'ps-tojson', label: 'to_json' }],
    [{ id: 'ps-topandas', label: 'to_pandas' }],
  ],
  { padding: 0.18 },
)

// Index strategies: how the pandas index is mapped onto a distributed dataset —
// the choice that trades correctness of row-order against performance.
const index = section(
  { id: 'ps-index', label: 'Index Strategies', color: PURPLE, sub: 'the distributed index' },
  [
    [{ id: 'ps-sequence', label: 'sequence' }],
    [{ id: 'ps-distributed', label: 'distributed' }],
    [{ id: 'ps-distseq', label: 'distributed-sequence' }],
    [{ id: 'ps-opsdiff', label: 'compute.ops_on_diff' }],
  ],
  { padding: 0.18 },
)

// Actions ∥ Index Strategies share the bottom band, both fed from the transforms.
const finish = group('ps-finish', columns([[actions], [index]], { tight: true }), { padding: 0 })

const layout = stack(
  [
    { node: create, rows: 3 },
    { node: transforms, rows: 3 },
    { node: finish, rows: 4 },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const sparkPandasApi: SceneSpec = {
  id: 'spark-pandas-api',
  topic: 'apache-spark',
  title: 'pandas API on Spark',
  subtitle: 'write pandas, run it distributed',
  ...layout,
  edges: [
    { from: 'ps-create', to: 'ps-transforms' },
    { from: 'ps-transforms', to: 'ps-actions' },
    { from: 'ps-transforms', to: 'ps-index' },
  ],
}
