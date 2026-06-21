import type { SceneSpec } from '../../types/scene.ts'
import { columns, container, group, rows, section, stack } from '../layout/patterns.ts'
import { BLUE, GREEN, ORANGE, PURPLE, RED, TEAL } from '../colors.ts'

// How Scala runs on the JVM — the whole of the execution-model reference diagram
// in one nested scene. Geometry IS the lesson: top→down is the lifecycle a
// program takes, and the three big JVM subsystems are containers whose inner
// nodes are their real parts.
//
// .scala → scalac → .class  (Scala's front-end — same bytecode story as Java)
//   → Class Loader  (Loading → Linking → Initialization)
//   → Runtime Data Areas  (Method Area / Heap / Stacks / PC / Native)
//   → Execution Engine  (Interpreter / JIT / GC)
//   → JNI → Native Libs, and ultimately the CPU.
//
// Built with the recursive resolver (container/stack/columns), like
// spark-execution.ts: every child is measured INSIDE its parent's box.

// Class Loader Sub-System: the three linking sub-phases live inside Loading→
// Linking→Init. Loading and Linking are themselves ordered mini-pipelines, shown
// as their own tight sections so the steps read in order.
const loading = section(
  { id: 'cl-loading', label: 'Loading', color: BLUE },
  [[{ id: 'cl-bootstrap', label: 'Bootstrap' }, { id: 'cl-ext', label: 'Extension' }, { id: 'cl-app', label: 'Application' }]],
  { padding: 0.2 },
)
const linking = section(
  { id: 'cl-linking', label: 'Linking', color: TEAL },
  [[{ id: 'cl-verify', label: 'Verify' }, { id: 'cl-prepare', label: 'Prepare' }, { id: 'cl-resolve', label: 'Resolve' }]],
  { padding: 0.2 },
)
const classLoader = container(
  { id: 'classloader', label: 'Class Loader Sub-System', color: BLUE, sub: 'find → verify → init classes' },
  stack(
    [
      { node: loading },
      { node: linking },
      { node: { id: 'cl-init', label: 'Initialization', color: PURPLE, kind: 'term', sub: 'run <clinit> / object init' } },
    ],
    { gap: 0.25 },
  ),
  { padding: 0.12 },
)

// Runtime Data Areas: two shared regions (Method Area, Heap) plus the per-thread
// trio (Stack, PC Register, Native Method Stack), side-by-side to read as
// parallel address spaces rather than a sequence.
const runtimeAreas = container(
  { id: 'runtime', label: 'Runtime Data Areas', color: PURPLE, sub: 'shared + per-thread memory' },
  rows(
    [[
      { id: 'rt-method', label: 'Method Area', color: TEAL, kind: 'term', sub: 'class data · shared' },
      { id: 'rt-heap', label: 'Heap', color: TEAL, kind: 'term', sub: 'objects · shared' },
      { id: 'rt-stack', label: 'JVM Stacks', color: BLUE, kind: 'term', sub: 'frames · per-thread' },
      { id: 'rt-pc', label: 'PC Registers', color: BLUE, kind: 'term', sub: 'per-thread' },
      { id: 'rt-native', label: 'Native Stacks', color: GREEN, kind: 'term', sub: 'per-thread' },
    ]],
    { tight: true },
  ),
  { padding: 0.18 },
)

// Execution Engine: the interpreter runs bytecode immediately; hot paths get
// handed to the JIT (its own pipeline), and the GC reclaims the heap alongside.
const jit = section(
  { id: 'ee-jit', label: 'JIT Compiler', color: ORANGE, sub: 'hot bytecode → native' },
  [[
    { id: 'jit-ir', label: 'IR Gen' },
    { id: 'jit-opt', label: 'Optimizer', color: RED },
    { id: 'jit-prof', label: 'Profiler', color: RED },
    { id: 'jit-target', label: 'Target Gen' },
  ]],
  { padding: 0.18 },
)
const engine = container(
  { id: 'engine', label: 'Execution Engine', color: ORANGE, sub: 'interpret · JIT · GC' },
  stack(
    [
      { node: { id: 'ee-interp', label: 'Interpreter', color: BLUE, kind: 'term', sub: 'runs bytecode now' } },
      { node: jit },
      { node: { id: 'ee-gc', label: 'Garbage Collector', color: GREEN, kind: 'term', sub: 'reclaims the heap' } },
    ],
    { gap: 0.25 },
  ),
  { padding: 0.12 },
)

// JNI bridges the engine to native libraries; everything ultimately drives the
// CPU. Shown as two leaves under the engine.
const nativeBridge = group(
  'native-bridge',
  columns([
    [{ id: 'jni', label: 'JNI', color: BLUE, kind: 'symbol', sub: 'native interface' }],
    [{ id: 'native-libs', label: 'Native Libs', color: BLUE, kind: 'symbol', sub: 'OS / C libraries' }],
  ]),
  { padding: 0.15 },
)

const layout = stack(
  [
    { node: { id: 'src', label: '.scala', color: TEAL, kind: 'symbol', sub: 'your source' } },
    { node: { id: 'scalac', label: 'scalac', color: TEAL, kind: 'symbol', sub: 'compiler' } },
    { node: { id: 'classfile', label: '.class', color: TEAL, kind: 'symbol', sub: 'JVM bytecode' } },
    { node: classLoader, rows: 4 },
    { node: runtimeAreas, rows: 2 },
    { node: engine, rows: 4 },
    { node: nativeBridge, rows: 2 },
    { node: { id: 'cpu', label: 'CPU', color: PURPLE, kind: 'symbol', sub: 'the processor' } },
  ],
  { gap: 0.3, padding: 0.5 },
)

export const scalaExecutionModel: SceneSpec = {
  id: 'scala-execution-model',
  topic: 'scala',
  title: 'How Scala Runs on the JVM',
  subtitle: '.scala → scalac → .class → class loader → runtime → engine → CPU',
  ...layout,
  edges: [
    { from: 'src', to: 'scalac' },
    { from: 'scalac', to: 'classfile' },
    { from: 'classfile', to: 'classloader' },
    { from: 'cl-loading', to: 'cl-linking' },
    { from: 'cl-linking', to: 'cl-init' },
    { from: 'classloader', to: 'runtime' },
    { from: 'runtime', to: 'engine' },
    { from: 'ee-interp', to: 'ee-jit' },
    { from: 'engine', to: 'jni' },
    { from: 'jni', to: 'native-libs' },
    { from: 'engine', to: 'cpu' },
  ],
}
