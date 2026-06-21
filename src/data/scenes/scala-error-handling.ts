import type { SceneSpec } from '../../types/scene.ts'
import { container, rows, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// Error handling in Scala, built around its defining idea: model failure as a
// VALUE in the type, instead of throwing it as out-of-band control flow. We
// contrast the JVM try/catch baseline with the three functional types —
// Option (absence), Try (caught exception), Either (typed error) — and show how
// they compose with a for-comprehension. match and for-comprehensions are from
// earlier reels, so they're used here, not re-taught.
//
// Flow top→down: the three error-as-value types → the JVM way → the value way.

// --- Diagram: the three ways to put failure in the type. ---
const typesDiagram = container(
  { id: 'eh-types', label: 'Errors as values', color: PURPLE, sub: 'model failure in the type — return, don’t throw' },
  rows(
    [[
      { id: 'eh-option', label: 'Option · Some/None', color: BLUE, kind: 'term' },
      { id: 'eh-try', label: 'Try · Success/Failure', color: TEAL, kind: 'term' },
      { id: 'eh-either', label: 'Either · Left/Right', color: ORANGE, kind: 'term' },
    ]],
    { tight: true },
  ),
  { padding: 0.16 },
)

// --- Exceptions: the imperative JVM baseline. Powerful, but invisible to types. ---
const tryCatchCode = {
  id: 'eh-trycatch-code',
  kind: 'code' as const,
  lang: 'scala',
  color: RED,
  cell: [0, 0] as [number, number],
  label:
    '// the JVM way — failure is NOT in the type signature\n' +
    'try\n' +
    '  risky()\n' +
    'catch\n' +
    '  case e: IllegalArgumentException => recover(e)\n' +
    '  case _: Exception                => fallback()\n' +
    'finally\n' +
    '  cleanup()                  // always runs',
}
const exceptions = container(
  { id: 'eh-trycatch-box', label: 'Exceptions', color: RED, sub: 'try / catch / finally — the JVM baseline' },
  { grid: { cols: 1, rows: 1 }, nodes: [tryCatchCode] },
  { padding: 0.08 },
)

// --- Errors as values: the three types in code, then composed with `for`. ---
const valuesCode = {
  id: 'eh-values-code',
  kind: 'code' as const,
  lang: 'scala',
  color: GREEN,
  cell: [0, 0] as [number, number],
  label:
    'def parse(s: String): Option[Int] = s.toIntOption\n' +
    'val t: Try[Int]      = Try(10 / 0)\n' +
    'def check(n: Int): Either[String, Int] =\n' +
    '  if n > 0 then Right(n) else Left("not positive")\n' +
    '\n' +
    '// compose with for — stops at the first failure\n' +
    'val r =\n' +
    '  for\n' +
    '    n <- parse("21")\n' +
    '    m <- parse("2")\n' +
    '  yield n * m                // Some(42)\n' +
    '\n' +
    'r.getOrElse(0)               // 42, or fallback on None',
}
const values = container(
  { id: 'eh-values-box', label: 'Errors as values', color: GREEN, sub: 'return failure · compose · getOrElse' },
  { grid: { cols: 1, rows: 1 }, nodes: [valuesCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: typesDiagram, rows: 4 },
    { node: exceptions, rows: 8 },
    { node: values, rows: 12 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaErrorHandling: SceneSpec = {
  id: 'scala-error-handling',
  topic: 'scala',
  title: 'Error Handling',
  subtitle: 'errors as values, not control flow · Option / Try / Either',
  ...layout,
  edges: [],
}
