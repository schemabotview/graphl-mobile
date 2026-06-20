import { useEffect, useMemo, useRef, useState } from 'react'
import { scenes } from '../../data/scenes/index.ts'
import { topicMeta } from '../../data/topics.ts'
import { navigate } from '../../router.ts'
import { SceneCard } from './SceneCard.tsx'
import './feed.css'

interface FeedProps {
  /** Only reels for this topic are shown. */
  topic: string
}

export function Feed({ topic }: FeedProps) {
  // This feed is scoped to a single topic; the index page picks which one.
  const topicScenes = useMemo(
    () => scenes.filter((s) => s.topic === topic),
    [topic],
  )

  // Browsers block audio autoplay until a user gesture. The first tap unlocks
  // sound for the whole feed (standard reels pattern); later taps toggle
  // play/pause on the active scene.
  const [unmuted, setUnmuted] = useState(false)
  const [paused, setPaused] = useState(false)

  const onTap = () => {
    if (!unmutedRef.current) setUnmuted(true)
    else setPaused((p) => !p)
  }

  // Keep the latest `unmuted` readable from the (once-attached) key listener so
  // its closure never goes stale.
  const unmutedRef = useRef(unmuted)
  unmutedRef.current = unmuted

  // Desktop: spacebar mirrors a tap (first press unlocks sound, then toggles
  // play/pause). preventDefault stops the page from also scrolling on space.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      e.preventDefault()
      if (!unmutedRef.current) setUnmuted(true)
      else setPaused((p) => !p)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="feed" onClick={onTap}>
      <header className="feed__brand">
        <button
          type="button"
          className="feed__home"
          aria-label="Back to all concepts"
          onClick={(e) => {
            // Don't let the tap also toggle play/pause on the feed.
            e.stopPropagation()
            navigate('')
          }}
        >
          <img className="feed__brand-glyph" src="/icon.svg" alt="" />
          <span className="feed__brand-name">GraphL</span>
        </button>
        <span className="feed__topic">{topicMeta(topic).label}</span>
      </header>

      {topicScenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          unmuted={unmuted}
          paused={paused}
        />
      ))}

      {unmuted && (
        <button
          type="button"
          className="feed__playstate"
          aria-label={paused ? 'Play' : 'Pause'}
          onClick={(e) => {
            // Don't let the click also bubble to the feed's toggle.
            e.stopPropagation()
            setPaused((p) => !p)
          }}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
