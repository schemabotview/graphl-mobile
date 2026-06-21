import type { SceneSpec } from '../../types/scene.ts'
import { container, fanOut, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE } from '../colors.ts'

// The two OOP pillars the hierarchy reel (scala-oop) doesn't cover: encapsulation
// and (subtype) polymorphism. Abstraction + inheritance already live in
// scala-oop; generics (parametric) and typeclasses (ad-hoc) are reels 9/10 — so
// this reel stays on hiding state and dynamic dispatch only.
//
// Flow top→down: hide state (encapsulation code) → the dispatch idea as a
// fan-out diagram → the same dispatch in code (polymorphism).

// --- Encapsulation: private state behind a safe, uniform interface. ---
const encCode = {
  id: 'enc-code',
  kind: 'code' as const,
  lang: 'scala',
  color: GREEN,
  cell: [0, 0] as [number, number],
  label:
    'class Account(initial: Int):\n' +
    '  private var bal = initial        // hidden state\n' +
    '  def balance = bal                // uniform access\n' +
    '  def deposit(n: Int): Unit =\n' +
    '    require(n > 0)                  // enforce invariant\n' +
    '    bal += n                       //   in one place\n' +
    '\n' +
    '  protected def audit() = log(bal) // subclasses only\n' +
    '  private[bank] def raw = bal      // same package only\n' +
    '\n' +
    'case class Point(x: Int, y: Int)   // params = public vals',
}

const encapsulation = container(
  { id: 'enc-box', label: 'Encapsulation', color: GREEN, sub: 'hide state · expose a safe interface' },
  { grid: { cols: 1, rows: 1 }, nodes: [encCode] },
  { padding: 0.08 },
)

// --- Dynamic dispatch: one call against a base reference, many runtime impls. ---
const dispatch = container(
  { id: 'pm-dispatch', label: 'Dynamic Dispatch', color: ORANGE, sub: 'one call · the runtime type decides' },
  fanOut(
    { id: 'pm-call', label: 'a.sound', sub: 'a: Animal', color: PURPLE, kind: 'symbol' },
    [
      { id: 'pm-dog', label: 'Dog', sub: '"woof"', color: BLUE, kind: 'term' },
      { id: 'pm-cat', label: 'Cat', sub: '"meow"', color: BLUE, kind: 'term' },
      { id: 'pm-cow', label: 'Cow', sub: '"moo"', color: BLUE, kind: 'term' },
    ],
    'vertical',
  ),
  { padding: 0.14 },
)

// --- Polymorphism in code: a list of subtypes, one call, program to the base. ---
const polyCode = {
  id: 'poly-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    'val pets: List[Animal] =\n' +
    '  List(Dog("Rex"), Cat("Tom"))    // subtypes together\n' +
    '\n' +
    'pets.map(_.sound)                 // List("woof","meow")\n' +
    '// runtime type picks the impl — dynamic dispatch\n' +
    '\n' +
    'def describe(a: Animal) =         // code to the abstraction\n' +
    '  s"${a.name}: ${a.sound}"        // any Animal subtype',
}

const polymorphism = container(
  { id: 'poly-box', label: 'Polymorphism', color: ORANGE, sub: 'program to the abstraction, not the type' },
  { grid: { cols: 1, rows: 1 }, nodes: [polyCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: encapsulation, rows: 11 },
    { node: dispatch, rows: 7 },
    { node: polymorphism, rows: 8 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaEncapsulationPolymorphism: SceneSpec = {
  id: 'scala-encapsulation-polymorphism',
  topic: 'scala',
  title: 'Encapsulation & Polymorphism',
  subtitle: 'hide state behind a safe interface · one call, many runtime impls',
  ...layout,
  edges: [
    { from: 'pm-call', to: 'pm-dog' },
    { from: 'pm-call', to: 'pm-cat' },
    { from: 'pm-call', to: 'pm-cow' },
  ],
}
