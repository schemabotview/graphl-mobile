import type { SceneSpec } from '../../types/scene.ts'
import { container, stack } from '../layout/patterns.ts'
import { BLUE, PURPLE, TEAL } from '../colors.ts'

// Control flow in Scala — shown as real, syntax-highlighted code, not abstract
// chips. On a portrait feed, three FULL-WIDTH code blocks stacked vertically beat
// three narrow columns: full width stops `white-space: pre` from clipping lines,
// and the tall canvas is used to show MORE forms of each construct.
//
// The "all three are expressions" nuance is carried in the narration (.tts), so
// no key-insight band here — the space goes to extra code examples instead.

// if / else — every expression form: ternary-style, else-if chain, no-else Unit.
const ifCode = {
  id: 'cf-if-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    '// if-else is an expression (Scala 3)\n' +
    'val s = if n > 0 then "pos" else "neg"\n' +
    '\n' +
    '// else-if chain returns the matched branch\n' +
    'val grade =\n' +
    '  if n >= 90 then "A"\n' +
    '  else if n >= 80 then "B"\n' +
    '  else "C"\n' +
    '\n' +
    '// no else -> result type is Unit\n' +
    'if debug then log(msg)',
}

const ifBlock = container(
  { id: 'cf-if', label: 'if / else', color: BLUE, sub: 'returns a value' },
  { grid: { cols: 1, rows: 1 }, nodes: [ifCode] },
  { padding: 0.08 },
)

// match — the full pattern vocabulary: literal, guard, tuple, constructor,
// type, sequence, binding (@), wildcard.
const matchCode = {
  id: 'cf-match-code',
  kind: 'code' as const,
  lang: 'scala',
  color: PURPLE,
  cell: [0, 0] as [number, number],
  label:
    'val out = x match\n' +
    '  case 0            => "zero"    // literal\n' +
    '  case n if n > 9   => "big"     // guard\n' +
    '  case (a, b)       => a + b     // tuple\n' +
    '  case Some(v)      => v         // constructor\n' +
    '  case s: String    => s.length  // type\n' +
    '  case h :: t       => h         // sequence\n' +
    '  case w @ Warn(_)  => keep(w)   // binding\n' +
    '  case _            => "other"   // wildcard',
}

const matchBlock = container(
  { id: 'cf-match', label: 'Pattern Match', color: PURPLE, sub: 'match / case / unapply' },
  { grid: { cols: 1, rows: 1 }, nodes: [matchCode] },
  { padding: 0.08 },
)

// loops — while, for-iteration, for-yield with guard, multiple generators.
const loopCode = {
  id: 'cf-loop-code',
  kind: 'code' as const,
  lang: 'scala',
  color: TEAL,
  cell: [0, 0] as [number, number],
  label:
    '// while — a statement, returns Unit\n' +
    'while i < n do i += 1\n' +
    '\n' +
    '// for over a range (side effects)\n' +
    'for i <- 1 to 3 do print(i)\n' +
    '\n' +
    '// for-yield builds a collection\n' +
    'val squares =\n' +
    '  for\n' +
    '    x <- 1 to 20\n' +
    '    if x % 2 == 0       // guard filters\n' +
    '  yield x * x\n' +
    '\n' +
    '// multiple generators = nested flatMap\n' +
    'for a <- xs; b <- ys yield (a, b)',
}

const loopBlock = container(
  { id: 'cf-loops', label: 'Loops & Comprehensions', color: TEAL, sub: 'while · for · for-yield' },
  { grid: { cols: 1, rows: 1 }, nodes: [loopCode] },
  { padding: 0.08 },
)

// Three full-width blocks stacked top→down; band `rows` ≈ line count so each
// block is sized to its code (minimal empty space).
const layout = stack(
  [
    { node: ifBlock, rows: 11 },
    { node: matchBlock, rows: 10 },
    { node: loopBlock, rows: 15 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaControlFlow: SceneSpec = {
  id: 'scala-control-flow',
  topic: 'scala',
  title: 'Control Flow',
  subtitle: 'if-else · match/case · for-yield — all expressions, all type-safe',
  ...layout,
  edges: [
    { from: 'cf-if', to: 'cf-match' },
    { from: 'cf-match', to: 'cf-loops' },
  ],
}
