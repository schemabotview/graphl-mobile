import { useEffect, useRef, useState } from 'react'
import type { SceneSpec } from '../../types/scene.ts'
import { audioUrl } from '../../data/content.ts'
import { SceneCanvas } from '../scene/SceneCanvas.tsx'

interface SceneCardProps {
  scene: SceneSpec
  /** Global gesture unlock — audio can only autoplay after the first tap. */
  unmuted: boolean
  /** Global play/pause toggle driven by taps on the feed; persists across scrolls. */
  paused: boolean
}

// One full-viewport reel. Becomes "active" when scrolled into view; activation
// (re)plays the entrance animation and, if unmuted, the narration audio.
// Loose sync: visuals run their own timeline, audio just plays alongside.
export function SceneCard({ scene, unmuted, paused }: SceneCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (active && unmuted && !paused) {
      audio.play().catch(() => {
        /* autoplay can still be blocked; ignored, visuals continue */
      })
    } else {
      audio.pause()
    }
  }, [active, unmuted, paused])

  // Restart narration from the top each time the card (re)activates, but keep
  // position when merely tap-paused so resuming continues where it left off.
  useEffect(() => {
    const audio = audioRef.current
    if (audio && active) audio.currentTime = 0
    setProgress(0)
  }, [active])

  return (
    <section ref={cardRef} className="scene-card">
      <SceneCanvas scene={scene} active={active} />

      <div className="scene-card__overlay">
        <span className="scene-card__topic">{scene.topic}</span>
        <h2 className="scene-card__title">{scene.title}</h2>
        {scene.subtitle && <p className="scene-card__subtitle">{scene.subtitle}</p>}
      </div>

      {active && (
        <div className="scene-card__progress" aria-hidden>
          <div
            className="scene-card__progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      <audio
        ref={audioRef}
        src={audioUrl(scene.topic, scene.audio ?? scene.id)}
        preload="none"
        playsInline
        onTimeUpdate={(e) => {
          const a = e.currentTarget
          setProgress(a.duration > 0 ? a.currentTime / a.duration : 0)
        }}
      />
    </section>
  )
}
