import { useEffect, useRef, useState } from 'react'
import type { SceneSpec } from '../../types/scene.ts'
import { SceneCanvas } from '../scene/SceneCanvas.tsx'

interface SceneCardProps {
  scene: SceneSpec
  /** Global gesture unlock — audio can only autoplay after the first tap. */
  unmuted: boolean
}

// One full-viewport reel. Becomes "active" when scrolled into view; activation
// (re)plays the entrance animation and, if unmuted, the narration audio.
// Loose sync: visuals run their own timeline, audio just plays alongside.
export function SceneCard({ scene, unmuted }: SceneCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState(false)

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
    if (active && unmuted) {
      audio.currentTime = 0
      audio.play().catch(() => {
        /* autoplay can still be blocked; ignored, visuals continue */
      })
    } else {
      audio.pause()
    }
  }, [active, unmuted])

  return (
    <section ref={cardRef} className="scene-card">
      <SceneCanvas scene={scene} active={active} />

      <div className="scene-card__overlay">
        <span className="scene-card__topic">{scene.topic}</span>
        <h2 className="scene-card__title">{scene.title}</h2>
        {scene.subtitle && <p className="scene-card__subtitle">{scene.subtitle}</p>}
      </div>

      {scene.audio && <audio ref={audioRef} src={scene.audio} preload="none" playsInline />}
    </section>
  )
}
