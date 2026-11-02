import { useEffect, useState } from 'react'
import { countHashtags } from '../../lib/analysis'
import type { CountResult } from '../../lib/analysis'
import { parseWholeNumber } from '../../lib/dataset'
import { CheckField, FieldGroup, NumberField } from '../fields'
import ResultView from '../ResultView'
import ToolPanel from '../ToolPanel'

type Props = { texts: string[]; ready: boolean; fileBase: string }

export default function HashtagsPanel({ texts, ready, fileBase }: Props) {
  // Settings
  const [mergeCase, setMergeCase] = useState(true)
  const [topText, setTopText] = useState('20')
  const [minText, setMinText] = useState('1')

  // Result of the last run
  const [result, setResult] = useState<CountResult | null>(null)
  const [ranWithMergeCase, setRanWithMergeCase] = useState(true)
  const [running, setRunning] = useState(false)

  // A new file or column makes the old result meaningless
  useEffect(() => {
    setResult(null)
  }, [texts])

  const topN = parseWholeNumber(topText, 1, 500, 20)
  const minCount = parseWholeNumber(minText, 1, 1000000, 1)

  const run = async () => {
    setRunning(true)
    // Give the browser a moment to show "Working…" before the counting starts
    await new Promise((resolve) => setTimeout(resolve, 30))
    setResult(countHashtags(texts, { mergeCase }))
    setRanWithMergeCase(mergeCase)
    setRunning(false)
  }

  // "Show top" and "minimum count" only change what is displayed, so they update live
  const rows = result ? result.rows.filter((row) => row.count >= minCount) : []

  return (
    <ToolPanel
      title="Hashtags"
      description="Find every hashtag and count how often each is used."
      ready={ready}
      running={running}
      hasResult={result !== null}
      stale={result !== null && ranWithMergeCase !== mergeCase}
      onRun={run}
      settings={
        <FieldGroup>
          <CheckField
            label="Treat #Tag and #tag as the same"
            checked={mergeCase}
            onChange={setMergeCase}
          />
          <NumberField label="Show top" value={topText} onChange={setTopText} min={1} max={500} />
          <NumberField
            label="Minimum uses"
            value={minText}
            onChange={setMinText}
            min={1}
            max={1000000}
          />
        </FieldGroup>
      }
    >
      {result && (
        <ResultView
          summary={`${result.totalCount.toLocaleString('en')} hashtag uses in ${result.postsWithMatch.toLocaleString('en')} of ${result.postsChecked.toLocaleString('en')} rows · ${result.rows.length.toLocaleString('en')} different hashtags`}
          rows={rows}
          topN={topN}
          heading="Hashtag"
          unit="uses"
          downloadName={`${fileBase}-hashtags.csv`}
          emptyMessage={
            result.rows.length === 0
              ? 'No hashtags found in this column.'
              : 'No hashtag is used that often. Lower the minimum.'
          }
        />
      )}
    </ToolPanel>
  )
}
