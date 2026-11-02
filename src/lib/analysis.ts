// Counting logic for the Filter and count tools.
// Everything here is plain TypeScript with no React, so it can be tested on its own.
// Each tool takes a list of texts (one per CSV row) and returns counts.

// One line of a result table
export type CountRow = {
  label: string // the hashtag, emoji, word or term
  count: number // how many times it appears in total
  posts: number // how many rows (texts) contain it at least once
}

export type CountResult = {
  rows: CountRow[] // sorted from most to least frequent
  totalCount: number // every occurrence found, added up
  postsWithMatch: number // rows with at least one match
  postsChecked: number // all rows that were searched
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

type Tally = Map<string, CountRow>

// Links are removed first so that "page.html#section" is not read as a hashtag
const urlPattern = /https?:\/\/\S+|www\.\S+/gi

// Records one occurrence of `key`. `seenInThisText` makes sure a row is only
// counted once in the "posts" column, however many times the key appears in it.
function addToTally(tally: Tally, key: string, label: string, seenInThisText: Set<string>) {
  let entry = tally.get(key)
  if (!entry) {
    entry = { label, count: 0, posts: 0 }
    tally.set(key, entry)
  }
  entry.count += 1
  if (!seenInThisText.has(key)) {
    seenInThisText.add(key)
    entry.posts += 1
  }
}

function sortRows(tally: Tally): CountRow[] {
  return [...tally.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  )
}

// ---------------------------------------------------------------------------
// Hashtags
// ---------------------------------------------------------------------------

// A # that is not glued to a word before it, followed by letters, digits or _
const hashtagPattern = /(?<![\p{L}\p{M}\p{N}_&])#([\p{L}\p{M}\p{N}_]+)/gu

export function countHashtags(texts: string[], options: { mergeCase: boolean }): CountResult {
  const tally: Tally = new Map()
  let totalCount = 0
  let postsWithMatch = 0

  for (const text of texts) {
    const seen = new Set<string>()
    for (const match of text.replace(urlPattern, ' ').matchAll(hashtagPattern)) {
      const tag = match[1]
      // "#1" or "#2024" are numbers, not hashtags: a hashtag needs a letter
      if (!/\p{L}/u.test(tag)) continue
      const label = '#' + (options.mergeCase ? tag.toLowerCase() : tag)
      addToTally(tally, label, label, seen)
      totalCount += 1
    }
    if (seen.size > 0) postsWithMatch += 1
  }

  return { rows: sortRows(tally), totalCount, postsWithMatch, postsChecked: texts.length }
}

// ---------------------------------------------------------------------------
// Emoji
// ---------------------------------------------------------------------------

// Matches whole emoji, not single code points, so these each count once:
//   flags (two regional indicators), keycaps (1️⃣), skin tones (👍🏽),
//   joined emoji (👨‍👩‍👧) and tag flags (🏴󠁧󠁢󠁥󠁮󠁧󠁿)
const emojiPattern =
  /\p{Regional_Indicator}{2}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])?(?:‍\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])?)*[\u{E0020}-\u{E007F}]*/gu

const skinTonePattern = /[\u{1F3FB}-\u{1F3FF}]/gu

export function countEmoji(texts: string[], options: { ignoreSkinTone: boolean }): CountResult {
  const tally: Tally = new Map()
  let totalCount = 0
  let postsWithMatch = 0

  for (const text of texts) {
    const seen = new Set<string>()
    for (const match of text.matchAll(emojiPattern)) {
      const found = match[0]
      // Plain © ® ™ are text symbols; only count them in their emoji form (with U+FE0F)
      if (found === '©' || found === '®' || found === '™') continue

      const shown = options.ignoreSkinTone ? found.replace(skinTonePattern, '') : found
      // "❤" and "❤️" differ only by an invisible selector, so they share one key
      const key = shown.replace(/️/g, '')
      addToTally(tally, key, shown, seen)

      // Show the emoji-style version (with U+FE0F) when we have seen one
      const entry = tally.get(key)
      if (entry && !entry.label.includes('️') && shown.includes('️')) {
        entry.label = shown
      }
      totalCount += 1
    }
    if (seen.size > 0) postsWithMatch += 1
  }

  return { rows: sortRows(tally), totalCount, postsWithMatch, postsChecked: texts.length }
}

// ---------------------------------------------------------------------------
// Word frequencies
// ---------------------------------------------------------------------------

export type WordOptions = {
  minLength: number // shortest word to keep, in characters
  stopwords: Set<string> // words to leave out (lowercase)
  ignoreLinks: boolean
  ignoreMentions: boolean
  ignoreHashtags: boolean
  ignoreNumbers: boolean
}

// A word is letters/digits, optionally joined by ' or - (don't, anak-anak, co-word)
const wordPattern = /[\p{L}\p{M}\p{N}]+(?:['-][\p{L}\p{M}\p{N}]+)*/gu
const mentionPattern = /[@＠][\p{L}\p{M}\p{N}_]+/gu
const anyHashtagPattern = /[#＃][\p{L}\p{M}\p{N}_]+/gu

export function countWords(texts: string[], options: WordOptions): CountResult {
  const tally: Tally = new Map()
  let totalCount = 0
  let postsWithMatch = 0

  for (const text of texts) {
    let cleaned = text.toLowerCase().replace(/[’‘]/g, "'")
    if (options.ignoreLinks) cleaned = cleaned.replace(urlPattern, ' ')
    if (options.ignoreMentions) cleaned = cleaned.replace(mentionPattern, ' ')
    if (options.ignoreHashtags) cleaned = cleaned.replace(anyHashtagPattern, ' ')

    const seen = new Set<string>()
    for (const match of cleaned.matchAll(wordPattern)) {
      // "trump's" and "trump" are the same word
      const word = match[0].replace(/'s$/, '')
      if (Array.from(word).length < options.minLength) continue
      if (options.ignoreNumbers && /^\p{N}+$/u.test(word)) continue
      if (options.stopwords.has(word)) continue
      addToTally(tally, word, word, seen)
      totalCount += 1
    }
    if (seen.size > 0) postsWithMatch += 1
  }

  return { rows: sortRows(tally), totalCount, postsWithMatch, postsChecked: texts.length }
}

// ---------------------------------------------------------------------------
// Specific words and phrases
// ---------------------------------------------------------------------------

export type TermOptions = {
  caseSensitive: boolean
  wholeWord: boolean // "vote" will not match inside "devoted"
}

export type TermResult = CountResult & {
  matchedRows: number[] // positions of the rows that contain at least one term
}

// Turns typed text into a pattern that matches it literally
function escapeForPattern(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function countTerms(texts: string[], terms: string[], options: TermOptions): TermResult {
  const flags = options.caseSensitive ? 'gu' : 'giu'
  const edge = '[\\p{L}\\p{M}\\p{N}_]'

  // One pattern per term, built once
  const patterns = terms.map((term) => {
    const body = escapeForPattern(term)
    const source = options.wholeWord ? `(?<!${edge})${body}(?!${edge})` : body
    return new RegExp(source, flags)
  })

  // Every term gets a row, even if it is never found (a zero is a result too)
  const rows: CountRow[] = terms.map((term) => ({ label: term, count: 0, posts: 0 }))
  const matchedRows: number[] = []

  texts.forEach((text, position) => {
    let foundAny = false
    patterns.forEach((pattern, index) => {
      const matches = text.match(pattern)
      if (matches) {
        rows[index].count += matches.length
        rows[index].posts += 1
        foundAny = true
      }
    })
    if (foundAny) matchedRows.push(position)
  })

  // Most frequent first; terms with the same count keep the order they were typed in
  rows.sort((a, b) => b.count - a.count)

  const totalCount = rows.reduce((sum, row) => sum + row.count, 0)
  return {
    rows,
    totalCount,
    postsWithMatch: matchedRows.length,
    postsChecked: texts.length,
    matchedRows,
  }
}
