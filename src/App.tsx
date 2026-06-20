import { Feed } from './components/feed/Feed.tsx'
import { IndexPage } from './components/index/IndexPage.tsx'
import { isLiveTopic } from './data/topics.ts'
import { useRoute } from './router.ts'

export default function App() {
  // Hash route: '' -> index, a live topic slug -> that topic's feed. Unknown
  // slugs fall through to the index.
  const slug = useRoute()
  return isLiveTopic(slug) ? <Feed topic={slug} /> : <IndexPage />
}
