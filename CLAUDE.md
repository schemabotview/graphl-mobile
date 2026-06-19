# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

graphl-mobile is a mobile-first PWA that presents technical topics (Apache Spark,
Kafka, Kotlin, Python, Databricks, ML, …) as a vertical, auto-playing feed of
**scenes** — short animated infographics with narration, styled like
Instagram Reels / YouTube Shorts. Each scene is a node graph with "flow in path"
animated edges plus a synced audio track.

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build — the only verification step
npm run preview   # preview the built bundle
```

No test runner/linter/formatter. `tsc -b` (run by `build`) is the typecheck gate.
In-repo imports use explicit `.ts`/`.tsx` extensions — match this.

## Architecture

```
Feed (vertical snap-scroll)
 └─ SceneCard (one full-viewport reel; IntersectionObserver → active)
     ├─ SceneCanvas (React Flow: builds nodes/edges from a SceneSpec)
     │   ├─ SceneNode  (custom node: 'symbol' | 'term', framer-motion entrance)
     │   └─ FlowEdge   (bezier + <animateMotion> dot = "flow in path")
     └─ <audio>        (narration; plays when active + unmuted)
```

### Scene = SceneSpec (the authoring contract)

A scene is declarative data, `src/types/scene.ts`. Nodes are placed on a grid by
`cell: [col, row, colSpan?, rowSpan?]`; `src/data/layout/grid.ts#resolveGrid`
(ported from NodeMap's `resolve()`) converts cells → pixel boxes, which become
React Flow node positions. React Flow's `fitView` then scales the virtual
800×1200 canvas to the device.

This `SceneSpec` shape is intentionally render-free because an AI generator will
emit it later (see Roadmap). Add a scene by creating
`src/data/scenes/<name>.ts` and registering it in `src/data/scenes/index.ts`.

Scene flow direction is inferred: `grid.cols > grid.rows` ⇒ horizontal handle
placement (left→right), else vertical (top→bottom).

### Audio / content convention (from the apache-spark repo)

Per topic under `public/content/<topic>/`:
- `tts/<stem>.tts` — plain spoken prose (no markdown/code) for ChatterboxTTS.
- `audio/<stem>.wav` — generated narration; **gitignored** (large binaries).

A scene's `audio` field points at `/content/<topic>/audio/<stem>.wav`. Audio
autoplay is gesture-gated: the first tap on the feed unmutes the whole session.

### A/V sync

Currently **loose sync** (chosen for v1): when a card becomes active its visuals
run a fixed entrance/flow timeline while the audio plays alongside — no per-word
alignment. The `SceneSpec` can later gain timed `steps` for keyframe sync without
touching the feed.

## Roadmap

- **Now:** hand-author scenes + `.tts`, generate `.wav` via the existing
  ChatterboxTTS Colab flow, drop into `public/content/<topic>/audio/`.
- **Later:** `scripts/generate-scene.ts` — topic prompt → Claude (Opus 4.8)
  emits `SceneSpec` JSON + `.tts` → batch TTS → feed entry.
- **Later:** Capacitor wrapper for app-store distribution (codebase stays as-is).

## Reference projects

- `~/Projects/NodeMap` — origin of the grid scene format + layout resolver (3D/R3F).
- `~/Projects/apache-spark` — origin of the tts/audio content pipeline conventions.
