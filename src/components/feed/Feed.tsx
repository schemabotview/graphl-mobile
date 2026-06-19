import { useState } from 'react'
import { scenes } from '../../data/scenes/index.ts'
import { SceneCard } from './SceneCard.tsx'
import './feed.css'

export function Feed() {
  // Browsers block audio autoplay until a user gesture. The first tap unlocks
  // sound for the whole feed (standard reels pattern).
  const [unmuted, setUnmuted] = useState(false)

  return (
    <div className="feed" onClick={() => setUnmuted(true)}>
      <header className="feed__brand">
        <img className="feed__brand-glyph" src="/icon.svg" alt="" />
        <span className="feed__brand-name">GraphL</span>
      </header>

      {scenes.map((scene) => (
        <SceneCard key={scene.id} scene={scene} unmuted={unmuted} />
      ))}

      {!unmuted && (
        <div className="feed__tap-hint">
          <span>tap to start sound</span>
        </div>
      )}
    </div>
  )
}
