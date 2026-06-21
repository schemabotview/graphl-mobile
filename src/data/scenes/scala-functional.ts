import type { SceneSpec } from '../../types/scene.ts'
import { container, rows, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, TEAL } from '../colors.ts'

// Functional programming in Scala, scoped to the one idea that makes the rest
// possible: functions are first-class VALUES. From there: lambdas (write a
// function inline), higher-order functions (pass/return functions), and closures
// (a function captures its surrounding scope). Collection HOFs (map/filter/fold
// mechanics) are the Collections reel; here `List.map` is only a one-line demo.
//
// Flow top→down: the values idea as a diagram → lambdas → higher-order → closures.

// --- Diagram: a function flows into `map` exactly like the data does. ---
const valuesDiagram = container(
  { id: 'fp-values', label: 'Functions are values', color: PURPLE, sub: 'pass a function like any other data' },
  rows([
    [
      { id: 'fp-nums', label: 'nums: List[Int]', color: BLUE, kind: 'term' },
      { id: 'fp-fn', label: 'f: Int => Int', color: PURPLE, kind: 'term' },
    ],
    [{ id: 'fp-map', label: 'map (higher-order)', color: ORANGE, kind: 'symbol' }],
    [{ id: 'fp-result', label: 'result: List[Int]', color: GREEN, kind: 'term' }],
  ]),
  { padding: 0.16 },
)

// --- Lambdas: a function written inline, and the fact that it has a type. ---
const lambdaCode = {
  id: 'fp-lambda-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    'val inc = (x: Int) => x + 1    // a function literal (lambda)\n' +
    'val f: Int => Int = inc        // functions have types too\n' +
    '\n' +
    'inc(10)                        // 11 — call like any function\n' +
    'List(1, 2, 3).map(_ + 1)       // `_` = x => x + 1',
}
const lambdas = container(
  { id: 'fp-lambda-box', label: 'Lambdas', color: BLUE, sub: 'write a function inline · it has a type' },
  { grid: { cols: 1, rows: 1 }, nodes: [lambdaCode] },
  { padding: 0.08 },
)

// --- Higher-order functions: take a function, return a function, compose them. ---
const hofCode = {
  id: 'fp-hof-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    '// take a function as a parameter\n' +
    'def twice(f: Int => Int)(x: Int) = f(f(x))\n' +
    'twice(_ + 3)(10)               // 16\n' +
    '\n' +
    '// return a function, then compose\n' +
    'def adder(n: Int): Int => Int = x => x + n\n' +
    'val add5 = adder(5)\n' +
    'val g = add5 andThen (_ * 2)   // add 5, then double\n' +
    'g(100)                         // 210',
}
const higherOrder = container(
  { id: 'fp-hof-box', label: 'Higher-Order Functions', color: ORANGE, sub: 'take · return · compose functions' },
  { grid: { cols: 1, rows: 1 }, nodes: [hofCode] },
  { padding: 0.08 },
)

// --- Closures: the returned lambda captures (closes over) a local variable. ---
const closureCode = {
  id: 'fp-closure-code',
  kind: 'code' as const,
  lang: 'scala',
  color: TEAL,
  cell: [0, 0] as [number, number],
  label:
    'def counter(): () => Int =\n' +
    '  var n = 0                    // local to counter\n' +
    '  () =>\n' +
    '    n += 1                     // the lambda captures `n`\n' +
    '    n\n' +
    '\n' +
    'val next = counter()\n' +
    'next(); next()                 // 1, then 2 — `n` survives',
}
const closures = container(
  { id: 'fp-closure-box', label: 'Closures', color: TEAL, sub: 'a function captures its enclosing scope' },
  { grid: { cols: 1, rows: 1 }, nodes: [closureCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: valuesDiagram, rows: 6 },
    { node: lambdas, rows: 6 },
    { node: higherOrder, rows: 9 },
    { node: closures, rows: 9 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaFunctional: SceneSpec = {
  id: 'scala-functional',
  topic: 'scala',
  title: 'Functional Programming',
  subtitle: 'functions are values · lambdas · higher-order · closures',
  ...layout,
  edges: [
    { from: 'fp-nums', to: 'fp-map' },
    { from: 'fp-fn', to: 'fp-map', label: 'as a value' },
    { from: 'fp-map', to: 'fp-result' },
  ],
}
