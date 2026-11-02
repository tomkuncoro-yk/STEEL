import { useEffect, useState } from 'react'
import { countWords } from '../../lib/analysis'
import type { CountResult } from '../../lib/analysis'
import { parseWholeNumber } from '../../lib/dataset'
import { englishStopwords, indonesianStopwords } from '../../lib/stopwords'
import { CheckField, FieldGroup, NumberField, SelectField } from '../fields'
import ResultView from '../ResultView'
import ToolPanel from '../ToolPanel'

type Props = { texts: string[]; ready: boolean; fileBase: string }

const stopwordChoices = [
  { value: 'both', label: 'English and Indonesian' },
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesian' },
  { value: 'none', label: 'None (count every word)' },
]

export default function WordFrequencyPanel({ texts, ready, fileBase }: Props) {
  const [topText, setTopText] = useState('15')
  const [minLengthText, setMinLengthText] = useState('3')
  const [stopwordChoice, setStopwordChoice] = useState('both')
  const [ignoreLinks, setIgnoreLinks] = useState(true)
  const [ignoreMentions, setIgnoreMentions] = useState(true)
  const [ignoreHashtags, setIgnoreHashtags] = useState(true)
  const [ignoreNumbers, setIgnoreNumbers] = useState(true)

  const [result, setResult] = useState<CountResult | null>(null)
  const [ranWith, setRanWith] = useState('')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setResult(null)
  }, [texts])

  const topN = parseWholeNumber(topText, 1, 500, 15)
  const minLength = parseWholeNumber(minLengthText, 1, 30, 3)

  // Everything that changes the counting itself (not just what is displayed)
  const settingsKey = JSON.stringify([
    minLength,
    stopwordChoice,
    ignoreLinks,
    ignoreMentions,
    ignoreHashtags,
    ignoreNumbers,
  ])

  const run = async () => {
    setRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 30))

    const stopwords = new Set<string>()
    if (stopwordChoice === 'en' || stopwordChoice === 'both') {
      englishStopwords.forEach((word) => stopwords.add(word))
    }
    if (stopwordChoice === 'id' || stopwordChoice === 'both') {
      indonesianStopwords.forEach((word) => stopwords.add(word))
    }

    setResult(
      countWords(texts, {
        minLength,
        stopwords,
        ignoreLinks,
        ignoreMentions,
        ignoreHashtags,
        ignoreNumbers,
      }),
    )
    setRanWith(settingsKey)
    setRunning(false)
  }

  return (
    <ToolPanel
      title="Word frequency histogram"
      description="Count the words and chart the most frequent ones."
      ready={ready}
      running={running}
      hasResult={result !== null}
      stale={result !== null && ranWith !== settingsKey}
      onRun={run}
      settings={
        <>
          <FieldGroup>
            <NumberField label="Show top" value={topText} onChange={setTopText} min={1} max={500} />
            <NumberField
              label="Shortest word (letters)"
              value={minLengthText}
              onChange={setMinLengthText}
              min={1}
              max={30}
            />
            <SelectField
              label="Leave out common words"
              value={stopwordChoice}
              onChange={setStopwordChoice}
              options={stopwordChoices}
            />
          </FieldGroup>
          <FieldGroup>
            <CheckField label="Ignore links" checked={ignoreLinks} onChange={setIgnoreLinks} />
            <CheckField label="Ignore @mentions" checked={ignoreMentions} onChange={setIgnoreMentions} />
            <CheckField label="Ignore #hashtags" checked={ignoreHashtags} onChange={setIgnoreHashtags} />
            <CheckField label="Ignore numbers" checked={ignoreNumbers} onChange={setIgnoreNumbers} />
          </FieldGroup>
        </>
      }
    >
      {result && (
        <ResultView
          summary={`${result.totalCount.toLocaleString('en')} words counted in ${result.postsWithMatch.toLocaleString('en')} of ${result.postsChecked.toLocaleString('en')} rows · ${result.rows.length.toLocaleString('en')} different words`}
          rows={result.rows}
          topN={topN}
          heading="Word"
          unit="uses"
          downloadName={`${fileBase}-word-frequencies.csv`}
          showChart
          emptyMessage="No words left to count. Try a shorter minimum length or fewer exclusions."
        />
      )}
    </ToolPanel>
  )
}
