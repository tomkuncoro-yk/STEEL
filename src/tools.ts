import filteringArt from './assets/art/filtering.svg'
import textAnalysisArt from './assets/art/text-analysis.svg'
import networksArt from './assets/art/networks.svg'
import visualisationArt from './assets/art/visualisation.svg'

// One entry per group. The front page is generated from this list, and the
// tool pages will be generated from the `tools` arrays later.
export type ToolGroup = {
  slug: string
  name: string
  blurb: string
  tools: string[]
  art: string
  alt: string
  // Optional label shown on the card, e.g. when data leaves the browser
  warning?: string
  // Shows an "Under construction" tag on the card's button
  underConstruction?: boolean
}

export const groups: ToolGroup[] = [
  {
    slug: 'filter-and-count',
    name: 'Filter and count',
    blurb: 'Pull out hashtags and emoji, count chosen words and chart word frequencies.',
    tools: [
      'Hashtags',
      'Emoji',
      'Word frequency histogram',
      'Count specific words',
    ],
    art: filteringArt,
    alt: 'Hand-drawn illustration of a figure striding past floating shapes and paper',
  },
  {
    slug: 'text-analysis',
    underConstruction: true,
    name: 'Text analysis',
    blurb: 'Tokenise text, split it into sentences, score sentiment and map co-words.',
    tools: [
      'Tokenise',
      'Split sentences',
      'Co-words',
      'Sentiment analysis (lexicon)',
    ],
    art: textAnalysisArt,
    alt: 'Hand-drawn illustration of a person sitting cross-legged behind an open book',
  },
  {
    slug: 'networks',
    underConstruction: true,
    name: 'Networks',
    blurb: 'Reply, co-hashtag, co-word and bipartite networks, exported as GEXF.',
    tools: [
      'Reply network',
      'Co-hashtag network',
      'Co-word network',
      'URL co-occurrence network',
      'Author–tag network',
      'Bipartite network',
      'Network → CSV',
    ],
    art: networksArt,
    alt: 'Hand-drawn illustration of a person dancing, tangled in headphone cable',
  },
  {
    slug: 'text-visualisation',
    underConstruction: true,
    name: 'Text visualisation',
    blurb: 'Word clouds, word trees and word lines sized by frequency.',
    tools: [
      'Word cloud',
      'Word tree',
      'Word lines sized by frequency',
      'RankFlow',
    ],
    art: visualisationArt,
    alt: 'Hand-drawn illustration of a person taking a selfie with a phone',
  },
]
