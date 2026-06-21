// Minimal hash router — no dependency. The app has two views (index and a per-topic
// feed); the path after `#/` is `<topic>/<stem>`, both parts optional:
//
//   #/                      -> {topic:'', stem:''}            (index)
//   #/apache-spark          -> {topic:'apache-spark'}         (that topic's feed)
//   #/scala/concurrency     -> {topic:'scala', stem:'concurrency'} (feed at a reel)
//
// Hash routing keeps deep links refresh-safe on GitHub Pages (no server rewrites)
// and gives the browser Back/Forward buttons for free.

import { useEffect, useState } from 'react'

/** A parsed hash route. `topic`/`stem` are '' when absent. */
export interface Route {
  topic: string
  stem: string
}

/** Parse the current hash into `{ topic, stem }`. */
function readRoute(): Route {
  const path = window.location.hash.replace(/^#\/?/, '')
  const [topic = '', stem = ''] = path.split('/')
  return { topic, stem }
}

/** Navigate to a hash path, e.g. navigate('apache-spark'), navigate('scala/concurrency'), navigate(''). */
export function navigate(slug: string): void {
  window.location.hash = slug ? `/${slug}` : '/'
}

/**
 * Update the hash without pushing a history entry or firing `hashchange`. Used to
 * reflect the scrolled-to reel in the URL (shareable) without re-rendering the feed.
 */
export function replaceRoute(slug: string): void {
  history.replaceState(null, '', slug ? `#/${slug}` : '#/')
}

/** Subscribe to the current route; re-renders on Back/Forward and navigate(). */
export function useRoute(): Route {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
