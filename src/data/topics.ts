// The index page is driven entirely by the scenes that exist: a "topic" is just a
// distinct `topic` value across the bundled `scenes`. New topics show up on the
// landing page automatically as soon as their first reel is registered.

import { scenes } from './scenes/index.ts'
import { BLUE, ORANGE, GRAY } from './colors.ts'

export interface TopicMeta {
  label: string
  accent: string
  blurb?: string
}

export interface LiveTopic extends TopicMeta {
  /** Bare topic id, e.g. 'apache-spark' (also the hash route slug). */
  id: string
  /** How many reels currently exist for this topic. */
  count: number
}

// Display metadata for known topics. Unknown topics fall back to a humanized slug.
const TOPIC_META: Record<string, TopicMeta> = {
  'apache-spark': {
    label: 'Apache Spark',
    accent: ORANGE,
    blurb: 'Distributed batch & stream processing',
  },
  'apache-kafka': {
    label: 'Apache Kafka',
    accent: BLUE,
    blurb: 'Distributed event streaming',
  },
}

/** Title-case a slug as a fallback label, e.g. 'apache-spark' -> 'Apache Spark'. */
function humanize(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Metadata for a topic id, falling back to a humanized slug for unknown topics. */
export function topicMeta(id: string): TopicMeta {
  return TOPIC_META[id] ?? { label: humanize(id), accent: GRAY }
}

/**
 * Distinct topics across `scenes`, in first-seen order, each with its reel count.
 * Drives the index page.
 */
export function liveTopics(): LiveTopic[] {
  const counts = new Map<string, number>()
  for (const scene of scenes) {
    counts.set(scene.topic, (counts.get(scene.topic) ?? 0) + 1)
  }
  return [...counts].map(([id, count]) => ({ id, count, ...topicMeta(id) }))
}

/** Whether a hash slug corresponds to a topic that has reels. */
export function isLiveTopic(id: string): boolean {
  return scenes.some((s) => s.topic === id)
}
