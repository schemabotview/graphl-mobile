import type { SceneNodeSpec, SceneSpec } from '../../types/scene.ts'
import { container, stack } from '../layout/patterns.ts'
import { BLUE, PURPLE, TEAL } from '../colors.ts'

// Object-oriented Scala, scoped to ONE class hierarchy so the reel stays a story
// instead of a feature dump. Top: a structural diagram (boxes + arrows) — the
// SHAPE of inheritance. Bottom: the SAME hierarchy as real code — the SYNTAX.
// Splitting shape vs syntax keeps the diagram label-free (no clipping) and the
// code block carries the vocabulary: abstract class, trait, extends, with,
// override, case class. Objects/companions, sealed ADTs, and generics live in
// their own reels.

// --- Top: structural hierarchy (hand-authored cells, like the diagram mocks) ---
// Left column is the inheritance spine Animal -> Mammal -> Dog; Walker (a trait)
// sits to the right and mixes into Dog. Labels are just the type + its kind.
const hierarchyNodes: SceneNodeSpec[] = [
  { id: 'oop-animal', label: 'Animal', sub: 'abstract class', color: PURPLE, kind: 'symbol', cell: [0, 0] },
  { id: 'oop-mammal', label: 'Mammal', sub: 'class', color: BLUE, kind: 'symbol', cell: [0, 1] },
  { id: 'oop-dog', label: 'Dog', sub: 'class', color: BLUE, kind: 'symbol', cell: [0, 2] },
  { id: 'oop-walker', label: 'Walker', sub: 'trait', color: TEAL, kind: 'symbol', cell: [2, 1] },
]

const hierarchy = container(
  { id: 'oop-model', label: 'Model — one class hierarchy', color: PURPLE, sub: 'abstract + trait → class → subclass' },
  { grid: { cols: 3, rows: 3 }, nodes: hierarchyNodes },
  { padding: 0.12 },
)

// --- Bottom: the same hierarchy in code (the OOP vocabulary in one snippet) ---
const oopCode = {
  id: 'oop-code',
  kind: 'code' as const,
  lang: 'scala',
  color: PURPLE,
  cell: [0, 0] as [number, number],
  label:
    'abstract class Animal(val name: String):  // abstract base\n' +
    '  def sound: String                        // abstract method\n' +
    '  def describe = s"$name says $sound"       // concrete method\n' +
    '\n' +
    'trait Walker:                              // trait = mixin\n' +
    '  def legs: Int\n' +
    '  def gait = "walks"                        // traits hold behavior\n' +
    '\n' +
    'class Mammal(name: String) extends Animal(name):\n' +
    '  def sound = "..."                         // implement abstract\n' +
    '\n' +
    'class Dog(name: String)\n' +
    '    extends Mammal(name) with Walker:       // extend + mix in\n' +
    '  override def sound = "woof"               // override\n' +
    '  def legs = 4\n' +
    '\n' +
    'case class Cat(name: String) extends Animal(name):\n' +
    '  def sound = "meow"                        // case class: eq/copy free',
}

const codeBlock = container(
  { id: 'oop-code-box', label: 'In code', color: PURPLE, sub: 'abstract · trait · extends · with · override · case class' },
  { grid: { cols: 1, rows: 1 }, nodes: [oopCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: hierarchy, rows: 7 },
    { node: codeBlock, rows: 15 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaOop: SceneSpec = {
  id: 'scala-oop',
  topic: 'scala',
  title: 'Object-Oriented Programming',
  subtitle: 'classes · abstract · traits · mixins · override · case classes',
  ...layout,
  edges: [
    { from: 'oop-animal', to: 'oop-mammal', label: 'extends' },
    { from: 'oop-mammal', to: 'oop-dog', label: 'extends' },
    { from: 'oop-walker', to: 'oop-dog', label: 'with' },
  ],
}
