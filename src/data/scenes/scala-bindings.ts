import type { SceneSpec } from '../../types/scene.ts'
import { columns, container, group, rows, section, stack } from '../layout/patterns.ts'
import { BLUE, GRAY, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// The anatomy of a Scala binding — and where the value it holds actually lives.
// Read top→bottom as a story: you DECLARE a binding (its Kind and Type), you
// give it a VALUE, and that value lands in a specific region of JVM MEMORY.
//
//   Kind   Name  :  Type   =   Value
//   val     x    :  Int    =   42
//
// The payoff is the Value→Memory mapping. To make it unmistakable, Value is a
// horizontal row sitting DIRECTLY ABOVE the matching Memory row, so each of the
// four shapes connects to its home with a short, straight, colored vertical
// edge — no crossing fan-out.

// Kind: how the name binds. val is an immutable binding, var a mutable one, lazy
// val defers evaluation to first use, def is a method (re-run on every call).
const kind = section(
  { id: 'b-kind', label: 'Kind', color: BLUE, sub: 'how it binds' },
  [
    [{ id: 'k-val', label: 'val', sub: 'immutable' }],
    [{ id: 'k-var', label: 'var', sub: 'mutable' }],
    [{ id: 'k-lazy', label: 'lazy val', sub: 'on first use' }],
    [{ id: 'k-def', label: 'def', sub: 'method' }],
  ],
  { padding: 0.18 },
)

// Type: the static category the value must inhabit (the full OOP catalog —
// class / object / trait / case class / enum — gets its own reel, scala-oop).
const type = section(
  { id: 'b-type', label: ': Type', color: PURPLE, sub: 'what shape' },
  [
    [{ id: 't-prim', label: 'Primitives', sub: 'Int Boolean' }],
    [{ id: 't-coll', label: 'Collections', sub: 'List Map' }],
    [{ id: 't-adt', label: 'sealed ADT' }],
    [{ id: 't-array', label: 'Array' }],
    [{ id: 't-generic', label: 'Generic[A]' }],
    [{ id: 't-tuple', label: 'Tuple' }],
  ],
  { padding: 0.18 },
)

// A concrete example anchors the abstract breakdown — one full-width box showing
// a real binding, so the eye reads the statement before unpacking its parts.
const example = group(
  'example',
  rows([[{ id: 'ex-binding', label: 'val x: Int = 1234', color: GRAY, kind: 'term' }]]),
  { padding: 0 },
)

// The declaration half: a worked example on top, then Kind and Type side-by-side
// (Name is just an identifier, shown in the grammar subtitle and the example).
const declare = container(
  { id: 'binding', label: 'Initialize', color: BLUE, sub: 'Kind  Name : Type = Value' },
  stack(
    [
      { node: example },
      { node: group('declare-cols', columns([[kind], [type]], { tight: true }), { padding: 0 }), rows: 4 },
    ],
    { gap: 0.3 },
  ),
  { padding: 0.12 },
)

// Value: the four shapes a right-hand side can take — a horizontal row so each
// chip sits directly above its memory home below.
const value = section(
  { id: 'value', label: '= Value', color: GREEN, sub: 'the right-hand side' },
  [[
    { id: 'val-prim', label: 'Primitive', sub: "42 true 'a'" },
    { id: 'val-obj', label: 'Object', sub: 'Person()' },
    { id: 'val-coll', label: 'Collection', sub: 'List() Map()' },
    { id: 'val-method', label: 'Method body', sub: 'n + 1 { … }' },
  ]],
  { padding: 0.18 },
)

// Memory: the four JVM regions, in the SAME column order as Value above.
// Primitives & references sit in the call's stack frame; objects are boxed on
// the shared heap; immutable collections share structure through a HAMT
// (persistent data structure); a def's body is bytecode in the Method Area.
const memory = section(
  { id: 'memory', label: 'Memory', color: RED, sub: 'where the value lives' },
  [[
    { id: 'mem-stack', label: 'Stack frame', sub: 'refs' },
    { id: 'mem-heap', label: 'Heap', sub: 'boxed objects' },
    { id: 'mem-hamt', label: 'HAMT', sub: 'persistent share' },
    { id: 'mem-method', label: 'Method Area', sub: 'def bytecode' },
  ]],
  { padding: 0.18 },
)

const layout = stack(
  [
    { node: declare, rows: 3 },
    { node: value, rows: 2 },
    { node: memory, rows: 2 },
  ],
  { gap: 0.35, padding: 0.5 },
)

export const scalaBindings: SceneSpec = {
  id: 'scala-bindings',
  topic: 'scala',
  title: 'Anatomy of a Binding',
  subtitle: 'Kind Name : Type = Value — and where the value lives',
  ...layout,
  // The mapping: each Value shape → its home in JVM memory. Aligned columns +
  // distinct colors make each pair traceable at a glance.
  edges: [
    { from: 'val-prim', to: 'mem-stack', color: BLUE },
    { from: 'val-obj', to: 'mem-heap', color: ORANGE },
    { from: 'val-coll', to: 'mem-hamt', color: TEAL },
    { from: 'val-method', to: 'mem-method', color: PURPLE },
  ],
}
