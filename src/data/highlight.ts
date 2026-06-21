// Syntax highlighting for 'code' nodes. Uses highlight.js core with only the
// languages we actually author (keeps the PWA bundle small — the full
// highlight.js pulls every grammar). Matches NodeMap's approach (hljs + a stock
// theme stylesheet) instead of a hand-rolled tokenizer/palette.
//
// To support a new language: import its grammar, registerLanguage, and add it to
// REGISTERED — that's the whole change.
import hljs from 'highlight.js/lib/core'
import scala from 'highlight.js/lib/languages/scala'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('scala', scala)

const REGISTERED = new Set(['scala'])

/**
 * Highlight a code snippet to HTML (hljs token spans). `lang` defaults to scala;
 * an unregistered language falls back to scala so we never throw on render.
 */
export function highlightCode(code: string, lang = 'scala'): string {
  const language = REGISTERED.has(lang) ? lang : 'scala'
  return hljs.highlight(code, { language, ignoreIllegals: true }).value
}
