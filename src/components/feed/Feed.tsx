import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { scenes } from '../../data/scenes/index.ts'
import { topicMeta } from '../../data/topics.ts'
import { navigate, replaceRoute } from '../../router.ts'
import { SceneCard } from './SceneCard.tsx'
import './feed.css'

interface FeedProps {
  /** Only reels for this topic are shown. */
  topic: string
  /** Deep-link target: the stem of a reel to scroll to on load (optional). */
  target?: string
}

export function Feed({ topic, target }: FeedProps) {
  // This feed is scoped to a single topic; the index page picks which one.
  const topicScenes = useMemo(
    () => scenes.filter((s) => s.topic === topic),
    [topic],
  )

  // Map each reel's stem -> its card element, so we can scroll to a chosen reel.
  const cardEls = useRef<Record<string, HTMLElement | null>>({})
  // The reel currently in view — drives the chapters list highlight + the URL.
  const [current, setCurrent] = useState(target || topicScenes[0]?.id || '')
  const [chaptersOpen, setChaptersOpen] = useState(false)

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

  // Jump straight to a deep-linked reel on load / when the target changes.
  useEffect(() => {
    if (!target) return
    cardEls.current[target]?.scrollIntoView()
  }, [target])

  // A card scrolled into view: remember it and reflect it in the URL (shareable),
  // without pushing history or firing a route change that would re-scroll us.
  const onActivate = useCallback(
    (stem: string) => {
      setCurrent(stem)
      replaceRoute(`${topic}/${stem}`)
    },
    [topic],
  )

  const jumpTo = (stem: string) => {
    cardEls.current[stem]?.scrollIntoView({ behavior: 'smooth' })
    setChaptersOpen(false)
  }

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
        <button
          type="button"
          className="feed__chapters-toggle"
          aria-label="Browse reels"
          aria-expanded={chaptersOpen}
          onClick={(e) => {
            e.stopPropagation()
            setChaptersOpen((o) => !o)
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </header>

      {topicScenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          unmuted={unmuted}
          paused={paused}
          innerRef={(el) => {
            cardEls.current[scene.id] = el
          }}
          onActivate={() => onActivate(scene.id)}
        />
      ))}

      {chaptersOpen && (
        <div
          className="feed__chapters"
          onClick={(e) => {
            // Backdrop tap closes the drawer; don't toggle play/pause.
            e.stopPropagation()
            setChaptersOpen(false)
          }}
        >
          <nav
            className="feed__chapters-panel"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${topicMeta(topic).label} reels`}
          >
            <p className="feed__chapters-heading">
              {topicMeta(topic).label} · {topicScenes.length} reels
            </p>
            <ol className="feed__chapters-list">
              {topicScenes.map((scene, i) => (
                <li key={scene.id}>
                  <button
                    type="button"
                    className="feed__chapter"
                    aria-current={scene.id === current}
                    onClick={() => jumpTo(scene.id)}
                  >
                    <span className="feed__chapter-num">{i + 1}</span>
                    <span className="feed__chapter-text">
                      <span className="feed__chapter-title">{scene.title}</span>
                      {scene.subtitle && (
                        <span className="feed__chapter-sub">{scene.subtitle}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      <button
        type="button"
        className="feed__playstate"
        aria-label={!unmuted || paused ? 'Play' : 'Pause'}
        onClick={(e) => {
          // Don't let the click also bubble to the feed's toggle.
          e.stopPropagation()
          // Before the first gesture the button unlocks sound; afterwards it
          // toggles play/pause on the active scene.
          if (!unmuted) setUnmuted(true)
          else setPaused((p) => !p)
        }}
      >
        {!unmuted || paused ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
