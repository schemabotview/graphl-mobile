// Minimal hash router — no dependency. The whole app is just two views (index and
// a per-topic feed), so the route is simply the slug after `#/`:
//
//   #/                -> '' (index)
//   #/apache-spark    -> 'apache-spark' (that topic's feed)
//
// Hash routing keeps deep links refresh-safe on GitHub Pages (no server rewrites)
// and gives the browser Back/Forward buttons for free.

import { useEffect, useState } from 'react'

/** Current route slug (the part after `#/`), '' for the index. */
function readSlug(): string {
  return window.location.hash.replace(/^#\/?/, '')
}

/** Navigate to a hash path, e.g. navigate('apache-spark') or navigate(''). */
export function navigate(slug: string): void {
  window.location.hash = slug ? `/${slug}` : '/'
}

/** Subscribe to the current route slug; re-renders on Back/Forward and navigate(). */
export function useRoute(): string {
  const [slug, setSlug] = useState(readSlug)
  useEffect(() => {
    const onChange = () => setSlug(readSlug())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return slug
}
