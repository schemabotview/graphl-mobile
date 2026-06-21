import type { SceneSpec } from '../../types/scene.ts'
import { container, fanOut, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE } from '../colors.ts'

// The Scala collections library: the family (one abstraction, three shapes), how
// to pick a concrete type, and the one uniform transformation API that works
// across all of them. This reel is the home for the collection HOFs (map/filter/
// fold/flatMap/groupBy) that the FP reel deliberately left out. Lambdas (FP) and
// for-comprehensions (control-flow) are referenced, not re-taught.
//
// Flow top→down: the family as a diagram → pick a collection → transform it.

// --- Diagram: Iterable → the three core shapes. ---
const familyDiagram = container(
  { id: 'col-family', label: 'The collection family', color: PURPLE, sub: 'one Iterable interface, three shapes' },
  fanOut(
    { id: 'col-iterable', label: 'Iterable', color: PURPLE, kind: 'symbol' },
    [
      { id: 'col-seq', label: 'Seq · ordered', color: BLUE, kind: 'term' },
      { id: 'col-set', label: 'Set · unique', color: GREEN, kind: 'term' },
      { id: 'col-map', label: 'Map · key→value', color: ORANGE, kind: 'term' },
    ],
    'vertical',
  ),
  { padding: 0.14 },
)

// --- Pick a collection: the common concrete types + immutable-by-default. ---
const pickCode = {
  id: 'col-pick-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    'val xs = List(1, 2, 3)       // linked list — fast head\n' +
    'val v  = Vector(1, 2, 3)     // indexed — good default\n' +
    'val a  = Array(1, 2, 3)      // mutable, JVM-backed\n' +
    'val s  = Set(1, 2, 2)        // unique → Set(1, 2)\n' +
    'val m  = Map("a" -> 1)       // key → value\n' +
    '\n' +
    '// immutable by default — ops return NEW collections\n' +
    'val ys = xs :+ 4             // List(1,2,3,4); xs unchanged',
}
const pick = container(
  { id: 'col-pick-box', label: 'Pick a collection', color: BLUE, sub: 'immutable by default · share structure' },
  { grid: { cols: 1, rows: 1 }, nodes: [pickCode] },
  { padding: 0.08 },
)

// --- Transform: the uniform HOF vocabulary, identical across collections. ---
const transformCode = {
  id: 'col-transform-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    'val ns = List(1, 2, 3, 4)\n' +
    '\n' +
    'ns.map(_ * 2)                // List(2, 4, 6, 8)\n' +
    'ns.filter(_ % 2 == 0)        // List(2, 4)\n' +
    'ns.reduce(_ + _)             // 10 — combine pairwise\n' +
    'ns.foldLeft(0)(_ + _)        // 10 — seed, then combine\n' +
    'ns.flatMap(n => List(n, -n)) // flatten nested results\n' +
    'ns.groupBy(_ % 2)            // Map(1->odds, 0->evens)',
}
const transform = container(
  { id: 'col-transform-box', label: 'Transform', color: ORANGE, sub: 'one HOF vocabulary for every collection' },
  { grid: { cols: 1, rows: 1 }, nodes: [transformCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: familyDiagram, rows: 6 },
    { node: pick, rows: 9 },
    { node: transform, rows: 9 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaCollections: SceneSpec = {
  id: 'scala-collections',
  topic: 'scala',
  title: 'Collections Library',
  subtitle: 'immutable by default · Seq / Set / Map · one uniform transform API',
  ...layout,
  edges: [
    { from: 'col-iterable', to: 'col-seq' },
    { from: 'col-iterable', to: 'col-set' },
    { from: 'col-iterable', to: 'col-map' },
  ],
}
