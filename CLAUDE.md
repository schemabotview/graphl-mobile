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

### Audio / content convention (decoupled from the app)

Reel narration is **not bundled** with the app. It lives in the per-topic
content repos (`schemabotview/<topic>-reels`, e.g. `apache-spark-reels`), and is
fetched at runtime via raw GitHub URLs. This keeps `dist` tiny so the Pages
deploy never times out on multi-MB audio.

Each `<topic>-reels` repo has three folders, keyed by a shared `<stem>` per reel:
- `scenes/<stem>.ts` — authored SceneSpec data (the app currently bundles its
  own copies in `src/data/scenes/`; this folder is the content home).
- `tts/<stem>.tts` — plain spoken prose (no markdown/code) for ChatterboxTTS.
- `audio/<stem>.wav` — generated narration; **committed** here (served via raw).

`src/data/content.ts#audioUrl(topic, stem)` resolves a scene to
`https://raw.githubusercontent.com/schemabotview/<topic>-reels/main/audio/<stem>.wav`.
A scene's `audio` field is just the stem (defaults to `id`); `topic` is the bare
topic (e.g. `apache-spark`) and `-reels` is appended to get the repo. Audio
autoplay is gesture-gated: the first tap on the feed unmutes the whole session.

Generate `.wav` from `.tts` with local ChatterboxTTS (`mps` on Apple Silicon),
inside the `chatterbox` conda env. `CONTENT_ROOT` defaults to `~/Apps`:

```bash
npm run audio                                   # every <root>/*-reels/tts/*.tts
conda run -n chatterbox python scripts/generate_audio.py --topic apache-kafka
```

After generating, **commit + push the .wav in the topic repo** so it serves via
raw. (Large pushes can need to run on a real network, not a sandbox.)

Target length per scene: 25–40s (~65–105 words) — one concept per scene.
Blank lines in a `.tts` become 300 ms pauses, which also pace the node reveals.

### A/V sync

Currently **loose sync** (chosen for v1): when a card becomes active its visuals
run a fixed entrance/flow timeline while the audio plays alongside — no per-word
alignment. The `SceneSpec` can later gain timed `steps` for keyframe sync without
touching the feed.

## Roadmap

- **Now:** hand-author scenes + `.tts` in the `<topic>-reels` repo, generate
  `.wav` via local ChatterboxTTS, then commit + push so it serves via raw.
- **Later:** `scripts/generate-scene.ts` — topic prompt → Claude (Opus 4.8)
  emits `SceneSpec` JSON + `.tts` → batch TTS → feed entry.
- **Later:** Capacitor wrapper for app-store distribution (codebase stays as-is).

## Reference projects

- `~/Projects/NodeMap` — origin of the grid scene format + layout resolver (3D/R3F).
- `~/Apps/<topic>-reels` — per-topic content repos (scenes/tts/audio); see
  `apache-spark-reels`, `apache-kafka-reels`.
