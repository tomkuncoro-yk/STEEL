import { useEffect, useId, useState } from 'react'
import { countTerms } from '../../lib/analysis'
import type { TermResult } from '../../lib/analysis'
import { downloadCsv } from '../../lib/download'
import type { Row } from '../../lib/dataset'
import { CheckField } from '../fields'
import ResultView from '../ResultView'
import ToolPanel from '../ToolPanel'

type Props = { texts: string[]; rows: Row[]; ready: boolean; fileBase: string }

export default function CountWordsPanel({ texts, rows, ready, fileBase }: Props) {
  const termsId = useId()
  const [termsText, setTermsText] = useState('')
  const [wholeWord, setWholeWord] = useState(true)
  const [caseSensitive, setCaseSensitive] = useState(false)

  const [result, setResult] = useState<TermResult | null>(null)
  const [ranWith, setRanWith] = useState('')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setResult(null)
  }, [texts])

  // One term per line, or separated by commas. Blank lines and repeats are dropped.
  const terms = Array.from(
    new Set(
      termsText
        .split(/[\n,]/)
        .map((term) => term.trim())
        .filter((term) => term !== ''),
    ),
  ).slice(0, 500)

  const settingsKey = JSON.stringify([terms, wholeWord, caseSensitive])
  const canRun = ready && terms.length > 0

  const run = async () => {
    setRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 30))
    setResult(countTerms(texts, terms, { wholeWord, caseSensitive }))
    setRanWith(settingsKey)
    setRunning(false)
  }

  // Saves the original rows (all columns) that contain at least one of the terms
  const saveMatchingRows = () => {
    if (!result) return
    const matching = result.matchedRows.map((position) => rows[position])
    downloadCsv(`${fileBase}-matching-rows.csv`, matching, false)
  }

  return (
    <ToolPanel
      title="Count specific words"
      description="Count chosen words or phrases, and save the rows that contain them."
      ready={ready}
      canRun={canRun}
      running={running}
      hasResult={result !== null}
      stale={result !== null && ranWith !== settingsKey}
      onRun={run}
      settings={
        <div className="settings-row">
          <div className="field">
            <label htmlFor={termsId}>Words or phrases</label>
            <textarea
              id={termsId}
              rows={2}
              value={termsText}
              onChange={(event) => setTermsText(event.target.value)}
              placeholder={'One per line, or separated by commas'}
              disabled={!ready}
            />
            <p className="field-hint">Each one is counted on its own, so overlapping phrases both count.</p>
          </div>
          <div className="field-stack">
            <CheckField
              label="Whole words only"
              checked={wholeWord}
              onChange={setWholeWord}
            />
            <CheckField
              label="Match capital letters exactly"
              checked={caseSensitive}
              onChange={setCaseSensitive}
            />
          </div>
        </div>
      }
    >
      {!canRun && ready && (
        <p className="metadata muted">Type at least one word or phrase to count.</p>
      )}
      {result && (
        <ResultView
          summary={`${result.totalCount.toLocaleString('en')} matches in ${result.postsWithMatch.toLocaleString('en')} of ${result.postsChecked.toLocaleString('en')} rows`}
          rows={result.rows}
          topN={500}
          heading="Term"
          unit="matches"
          downloadName={`${fileBase}-term-counts.csv`}
          emptyMessage="Nothing to show."
          actions={
            <button
              type="button"
              className="pill pill-outline"
              onClick={saveMatchingRows}
              disabled={result.matchedRows.length === 0}
            >
              Download the {result.matchedRows.length.toLocaleString('en')} matching rows (CSV)
            </button>
          }
        />
      )}
    </ToolPanel>
  )
}
