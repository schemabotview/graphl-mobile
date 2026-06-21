import type { SceneSpec } from '../../types/scene.ts'
import { container, pipeline, stack } from '../layout/patterns.ts'
import { BLUE, ORANGE, PURPLE } from '../colors.ts'

// Concurrency in Scala via Future: a value that will arrive later, run on an
// ExecutionContext, and composed without blocking — the async echo of the
// error-handling railway (map/flatMap/for, short-circuit on Failure). Actor
// frameworks (Akka/Pekko) are libraries, so they're a narration aside, not here.
//
// Flow top→down: the Future lifecycle as a diagram → create & compose → complete.

// --- Diagram: submit work → it runs on a pool → it completes Success/Failure. ---
const lifecycle = container(
  { id: 'ftr-life', label: 'A Future — a value that arrives later', color: PURPLE, sub: 'submit work · keep going · use it when ready' },
  pipeline(
    [
      { id: 'ftr-future', label: 'Future { work }', color: PURPLE, kind: 'symbol' },
      { id: 'ftr-ec', label: 'ExecutionContext · pool', color: BLUE, kind: 'symbol' },
      { id: 'ftr-result', label: 'Success / Failure', color: ORANGE, kind: 'symbol' },
    ],
    'vertical',
  ),
  { padding: 0.14 },
)

// --- Create & compose: non-blocking transforms; start futures to run in parallel. ---
const composeCode = {
  id: 'con-compose-code',
  kind: 'code' as const,
  lang: 'scala',
  color: BLUE,
  cell: [0, 0] as [number, number],
  label:
    'val f: Future[Int] = Future:   // starts now, returns at once\n' +
    '  slowFetch()                  // runs on a pool thread\n' +
    '\n' +
    'f.map(_ * 2)                   // transform later — non-blocking\n' +
    '\n' +
    '// start both BEFORE the for → they run concurrently\n' +
    'val fa = fetchA()\n' +
    'val fb = fetchB()\n' +
    'val both =\n' +
    '  for\n' +
    '    a <- fa\n' +
    '    b <- fb\n' +
    '  yield a + b                  // done when both finish',
}
const compose = container(
  { id: 'con-compose-box', label: 'Create & Compose', color: BLUE, sub: 'map / flatMap / for — never block to chain' },
  { grid: { cols: 1, rows: 1 }, nodes: [composeCode] },
  { padding: 0.08 },
)

// --- Complete: react to the result, recover failures, gather many, block at edge. ---
const completeCode = {
  id: 'con-complete-code',
  kind: 'code' as const,
  lang: 'scala',
  color: ORANGE,
  cell: [0, 0] as [number, number],
  label:
    'both.onComplete:               // react when it completes\n' +
    '  case Success(n) => use(n)\n' +
    '  case Failure(e) => log(e)    // exceptions are folded in\n' +
    '\n' +
    'val safe = risky().recover:    // handle failure, stay async\n' +
    '  case _: TimeoutException => 0\n' +
    '\n' +
    'Future.sequence(futures)       // many → one Future[List]\n' +
    'Await.result(both, 2.seconds)  // block ONLY at the edge',
}
const complete = container(
  { id: 'con-complete-box', label: 'Complete & Recover', color: ORANGE, sub: 'onComplete · recover · sequence · Await' },
  { grid: { cols: 1, rows: 1 }, nodes: [completeCode] },
  { padding: 0.08 },
)

const layout = stack(
  [
    { node: lifecycle, rows: 6 },
    { node: compose, rows: 12 },
    { node: complete, rows: 9 },
  ],
  { gap: 0.4, padding: 0.5 },
)

export const scalaConcurrency: SceneSpec = {
  id: 'scala-concurrency',
  topic: 'scala',
  title: 'Parallel & Async Programming',
  subtitle: 'Future = a value that arrives later · compose without blocking',
  ...layout,
  edges: [
    { from: 'ftr-future', to: 'ftr-ec', label: 'runs on' },
    { from: 'ftr-ec', to: 'ftr-result', label: 'completes' },
  ],
}
