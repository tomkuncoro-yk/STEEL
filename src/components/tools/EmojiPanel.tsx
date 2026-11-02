import { useEffect, useState } from 'react'
import { countEmoji } from '../../lib/analysis'
import type { CountResult } from '../../lib/analysis'
import { parseWholeNumber } from '../../lib/dataset'
import { CheckField, FieldGroup, NumberField } from '../fields'
import ResultView from '../ResultView'
import ToolPanel from '../ToolPanel'

type Props = { texts: string[]; ready: boolean; fileBase: string }

export default function EmojiPanel({ texts, ready, fileBase }: Props) {
  const [ignoreSkinTone, setIgnoreSkinTone] = useState(false)
  const [topText, setTopText] = useState('20')
  const [minText, setMinText] = useState('1')

  const [result, setResult] = useState<CountResult | null>(null)
  const [ranWithSkinTone, setRanWithSkinTone] = useState(false)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setResult(null)
  }, [texts])

  const topN = parseWholeNumber(topText, 1, 500, 20)
  const minCount = parseWholeNumber(minText, 1, 1000000, 1)

  const run = async () => {
    setRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 30))
    setResult(countEmoji(texts, { ignoreSkinTone }))
    setRanWithSkinTone(ignoreSkinTone)
    setRunning(false)
  }

  const rows = result ? result.rows.filter((row) => row.count >= minCount) : []

  return (
    <ToolPanel
      title="Emoji"
      description="Find every emoji and count how often each is used."
      ready={ready}
      running={running}
      hasResult={result !== null}
      stale={result !== null && ranWithSkinTone !== ignoreSkinTone}
      onRun={run}
      settings={
        <FieldGroup>
          <CheckField
            label="Ignore skin tone (👍🏽 = 👍)"
            checked={ignoreSkinTone}
            onChange={setIgnoreSkinTone}
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
          summary={`${result.totalCount.toLocaleString('en')} emoji uses in ${result.postsWithMatch.toLocaleString('en')} of ${result.postsChecked.toLocaleString('en')} rows · ${result.rows.length.toLocaleString('en')} different emoji`}
          rows={rows}
          topN={topN}
          heading="Emoji"
          unit="uses"
          downloadName={`${fileBase}-emoji.csv`}
          bigLabels
          emptyMessage={
            result.rows.length === 0
              ? 'No emoji found in this column.'
              : 'No emoji is used that often. Lower the minimum.'
          }
        />
      )}
    </ToolPanel>
  )
}
