import type { SceneSpec } from '../../types/scene.ts'
import { container, rows, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, TEAL } from '../colors.ts'

// Contextual abstractions — the last reel of the series, and the ad-hoc
// polymorphism the type-system reel (scala-types) pointed at. Scala 2 spelled
// this `implicit`; Scala 3 split that one overloaded keyword into clear pieces:
// `given`/`using` (context parameters), type classes built from them, and
// `extension` methods. Parametric polymorphism (scala-types) writes one body for
// every type; type classes add behavior PER type without touching the type.
//
// Flow top→down: how the compiler resolves a given (diagram) → given/using →
// type classes → extension methods.

// --- Diagram: you ask with `using`; the compiler finds and injects the given. ---
const resolutionDiagram = container(
  { id: 'ctx-idea', label: 'The compiler supplies it', color: PURPLE, sub: 'ask with `using` · the compiler finds the `given`' },
  rows([
    [{ id: 'ctx-call', label: 'call site · needs a value', color: BLUE, kind: 'term' }],
    [{ id: 'ctx-search', label: 'searches the given scope', color: PURPLE, kind: 'symbol' }],
    [{ id: 'ctx-inject', label: 'injects the given · at compile time', color: GREEN, kind: 'term' }],
  ]),
  { padding: 0.16 },
)

// --- given / using: a value the compiler can supply, and a slot that asks for it. ---
const givenCode = {
  id: 'ctx-given-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    'given greeting: String = "Hello"   // a value in scope\n' +
    '\n' +
    'def greet(name: String)(using g: String) =\n' +
    '  s"$g, $name"                     // `using` = ask for it\n' +
    '\n' +
    'greet("Ada")                       // compiler injects it',
}
const givenUsing = container(
  { id: 'ctx-given-box', label: 'given / using', color: BLUE, sub: 'context parameters · no argument at the call site' },
  { grid: { cols: 1, rows: 1 }, nodes: [givenCode] },
  { padding: 0.08 },
)

// --- Type classes: add behavior PER type, required (not inherited) via `using`. ---
const typeclassCode = {
  id: 'ctx-typeclass-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    'trait Show[A]:                     // a capability\n' +
    '  def show(a: A): String\n' +
    '\n' +
    'given Show[Int] with               // an instance for Int\n' +
    '  def show(a: Int) = s"Int($a)"\n' +
    '\n' +
    'def log[A](a: A)(using s: Show[A]) = s.show(a)\n' +
    'log(42)                            // "Int(42)" — ad-hoc',
}
const typeClasses = container(
  { id: 'ctx-typeclass-box', label: 'Type Classes', color: ORANGE, sub: 'ad-hoc polymorphism · behavior per type, no subtyping' },
  { grid: { cols: 1, rows: 1 }, nodes: [typeclassCode] },
  { padding: 0.08 },
)

// --- Extension methods: add a method to a type you don't own. ---
const extensionCode = {
  id: 'ctx-extension-code',
  kind: 'code' as const,
  lang: 'scala',
  color: TEAL,
  cell: [0, 0] as [number, number],
  label:
    'extension (s: String)              // add to String\n' +
    '  def shout: String = s.toUpperCase + "!"\n' +
    '\n' +
    '"hello".shout                      // "HELLO!"\n' +
    '\n' +
    'extension [A](a: A)                // pairs with Show\n' +
    '  def show(using s: Show[A]) = s.show(a)\n' +
    '42.show                            // "Int(42)"',
}
const extensions = container(
  { id: 'ctx-extension-box', label: 'Extension Methods', color: TEAL, sub: 'add methods to existing types · clean call syntax' },
  { grid: { cols: 1, rows: 1 }, nodes: [extensionCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: resolutionDiagram, rows: 6 },
    { node: givenUsing, rows: 7 },
    { node: typeClasses, rows: 9 },
    { node: extensions, rows: 9 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaContextual: SceneSpec = {
  id: 'scala-contextual',
  topic: 'scala',
  title: 'Implicits & Givens',
  subtitle: 'context parameters (given/using) · type classes · extension methods',
  ...layout,
  edges: [
    { from: 'ctx-call', to: 'ctx-search' },
    { from: 'ctx-search', to: 'ctx-inject' },
  ],
}
