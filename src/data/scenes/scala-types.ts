import type { SceneSpec } from '../../types/scene.ts'
import { container, rows, stack } from '../layout/patterns.ts'
import { BLUE, GRAY, GREEN, ORANGE, PURPLE } from '../colors.ts'

// The type system & generics: Scala's one unified type hierarchy (Any at the
// top, Nothing at the bottom), parametric polymorphism via type parameters, and
// how generics relate under subtyping — variance (+A / -A) and bounds (<: / >:).
// Subtype polymorphism is the encapsulation/polymorphism reel; typeclasses and
// givens are reel 12. This reel is parametric polymorphism + variance/bounds.
//
// Flow top→down: the type hierarchy as a diagram → generics → variance & bounds.

// --- Diagram: every type sits between Any (top) and Nothing (bottom). ---
const hierarchy = container(
  { id: 'ty-hier', label: 'One unified hierarchy', color: PURPLE, sub: 'every type is between Any and Nothing' },
  rows(
    [
      [{ id: 'ty-any', label: 'Any', color: PURPLE, kind: 'symbol' }],
      [
        { id: 'ty-anyval', label: 'AnyVal · Int, Boolean…', color: BLUE, kind: 'term' },
        { id: 'ty-anyref', label: 'AnyRef · String, List…', color: GREEN, kind: 'term' },
      ],
      [{ id: 'ty-nothing', label: 'Nothing · subtype of all', color: GRAY, kind: 'symbol' }],
    ],
    { tight: true },
  ),
  { padding: 0.14 },
)

// --- Generics: type parameters on classes and methods; the compiler infers them. ---
const genericsCode = {
  id: 'ty-generics-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    'class Box[A](val value: A)        // a type parameter\n' +
    'def first[A](xs: List[A]): A = xs.head\n' +
    '\n' +
    'Box(42)                           // A inferred as Int\n' +
    'Box("hi")                         // A inferred as String\n' +
    'first(List(1, 2, 3))              // A inferred as Int\n' +
    '\n' +
    '// one definition, every type = parametric polymorphism',
}
const generics = container(
  { id: 'ty-generics-box', label: 'Generics', color: BLUE, sub: 'type parameters · inferred · work for any type' },
  { grid: { cols: 1, rows: 1 }, nodes: [genericsCode] },
  { padding: 0.08 },
)

// --- Variance & bounds: how Box[A] relates to Box[B], and constraining A. ---
const varianceCode = {
  id: 'ty-variance-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    'class Box[+A]    // covariant — Box[Cat] <: Box[Animal]\n' +
    'class Sink[-A]   // contravariant — relation flips\n' +
    'class Cell[A]    // invariant — no subtype relation\n' +
    '\n' +
    '// bounds constrain the type parameter\n' +
    'def pick[A <: Animal](x: A) = ???   // upper bound (<:)\n' +
    'def add[B >: Cat](xs: B)    = ???   // lower bound (>:)',
}
const variance = container(
  { id: 'ty-variance-box', label: 'Variance & Bounds', color: ORANGE, sub: '+A / −A relate generics · <: />: constrain them' },
  { grid: { cols: 1, rows: 1 }, nodes: [varianceCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: hierarchy, rows: 6 },
    { node: generics, rows: 9 },
    { node: variance, rows: 8 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaTypes: SceneSpec = {
  id: 'scala-types',
  topic: 'scala',
  title: 'Type System & Generics',
  subtitle: 'one hierarchy: Any → Nothing · generics · variance (+A/−A) · bounds (<:/>:)',
  ...layout,
  edges: [
    { from: 'ty-any', to: 'ty-anyval' },
    { from: 'ty-any', to: 'ty-anyref' },
    { from: 'ty-anyval', to: 'ty-nothing' },
    { from: 'ty-anyref', to: 'ty-nothing' },
  ],
}
