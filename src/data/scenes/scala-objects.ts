import type { SceneSpec } from '../../types/scene.ts'
import { columns, container, stack } from '../layout/patterns.ts'
import { BLUE, PURPLE, TEAL } from '../colors.ts'

// Objects & companions — the last beat of the OOP arc (after scala-oop and
// scala-encapsulation-polymorphism). Scala has no `static`: a standalone
// `object` is a lazily-created singleton, and an object sharing a class's name
// is its companion, the home for factories (`apply`) and extractors (`unapply`).
//
// Flow top→down: the singleton (foundation + the "no static" point) → companions
// as a diagram (class + object, same name) → the apply/unapply payoff in code.

// --- Singleton object: one lazy instance; where static-like members live. ---
const singletonCode = {
  id: 'obj-singleton-code',
  kind: 'code' as const,
  lang: 'scala',
  color: TEAL,
  cell: [0, 0] as [number, number],
  label:
    'object Logger:                     // one lazy instance\n' +
    '  var level = "info"\n' +
    '  def log(m: String) = println(m)\n' +
    '\n' +
    'Logger.log("hi")                   // call on the object itself\n' +
    '\n' +
    '// Scala has NO `static` —\n' +
    '// module-level members live in an object',
}

const singleton = container(
  { id: 'obj-singleton-box', label: 'Singleton Object', color: TEAL, sub: 'one instance · replaces `static`' },
  { grid: { cols: 1, rows: 1 }, nodes: [singletonCode] },
  { padding: 0.08 },
)

// --- Companions: a class and an object with the SAME name, side by side. ---
const companions = container(
  { id: 'obj-companion', label: 'Companions', color: PURPLE, sub: 'class + object · same name & file' },
  columns(
    [
      [{ id: 'co-class', label: 'class Cat', sub: 'the type · instances', color: BLUE, kind: 'symbol' }],
      [{ id: 'co-object', label: 'object Cat', sub: 'companion · singleton', color: PURPLE, kind: 'symbol' }],
    ],
    { tight: true },
  ),
  { padding: 0.16 },
)

// --- apply / unapply: factory (no `new`) and extractor (pattern matching). ---
const companionCode = {
  id: 'obj-companion-code',
  kind: 'code' as const,
  lang: 'scala',
  color: PURPLE,
  cell: [0, 0] as [number, number],
  label:
    'class Cat(val name: String):\n' +
    '  private val id = nextId            // hidden per-instance\n' +
    '\n' +
    'object Cat:                          // companion: same name\n' +
    '  private def nextId = ???           // shared privates\n' +
    '  def apply(n: String) = new Cat(n)  // factory · no `new`\n' +
    '  def unapply(c: Cat) = Some(c.name) // extractor for `match`\n' +
    '\n' +
    'val c = Cat("Tom")                   // apply runs — no `new`\n' +
    'c match\n' +
    '  case Cat(n) => n                   // unapply runs — match',
}

const companionPayoff = container(
  { id: 'obj-companion-code-box', label: 'apply & unapply', color: PURPLE, sub: 'factory + extractor' },
  { grid: { cols: 1, rows: 1 }, nodes: [companionCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: singleton, rows: 8 },
    { node: companions, rows: 6 },
    { node: companionPayoff, rows: 11 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaObjects: SceneSpec = {
  id: 'scala-objects',
  topic: 'scala',
  title: 'Objects & Companions',
  subtitle: 'singletons replace static · companion apply/unapply = factory + extractor',
  ...layout,
  edges: [
    { from: 'co-class', to: 'co-object', label: 'share privates' },
  ],
}
