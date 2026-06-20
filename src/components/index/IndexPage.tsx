import { liveTopics } from '../../data/topics.ts'
import { navigate } from '../../router.ts'
import './index.css'

// Landing page: the catalog of concepts. Each card opens that topic's feed.
// Topics are derived from the reels that exist (see liveTopics), so the grid
// grows automatically as content is added.
export function IndexPage() {
  const topics = liveTopics()

  return (
    <main className="index">
      <header className="index__hero">
        <img className="index__glyph" src="/icon.svg" alt="" />
        <h1 className="index__brand">GraphL</h1>
        <p className="index__tagline">Pick a concept to start watching</p>
      </header>

      <ul className="index__grid">
        {topics.map((topic) => (
          <li key={topic.id}>
            <button
              type="button"
              className="index__card"
              style={{ '--accent': topic.accent } as React.CSSProperties}
              onClick={() => navigate(topic.id)}
            >
              <span className="index__card-label">{topic.label}</span>
              {topic.blurb && <span className="index__card-blurb">{topic.blurb}</span>}
              <span className="index__card-count">
                {topic.count} {topic.count === 1 ? 'reel' : 'reels'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
