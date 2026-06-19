// Reel content (narration audio) is NOT bundled with the app. It lives in the
// per-topic content repos (schemabotview/<topic>-reels) under an `audio/` folder
// and is fetched at runtime via raw GitHub URLs — same model as NodeMap's
// notebook content. This keeps the deployed bundle tiny (no multi-MB .wav in dist).
//
//   public:  https://raw.githubusercontent.com/schemabotview/<topic>-reels/main/audio/<stem>.wav
//   author:  ~/Apps/<topic>-reels/{scenes,tts,audio}/<stem>.*  (see scripts/generate_audio.py)

const CONTENT_BASE = 'https://raw.githubusercontent.com/schemabotview'
const BRANCH = 'main'

/** Resolve a scene's narration audio to its raw GitHub URL. */
export function audioUrl(topic: string, stem: string): string {
  return `${CONTENT_BASE}/${topic}-reels/${BRANCH}/audio/${stem}.wav`
}
