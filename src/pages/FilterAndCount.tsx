import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ColumnStep from '../components/ColumnStep'
import UploadStep from '../components/UploadStep'
import CountWordsPanel from '../components/tools/CountWordsPanel'
import EmojiPanel from '../components/tools/EmojiPanel'
import HashtagsPanel from '../components/tools/HashtagsPanel'
import WordFrequencyPanel from '../components/tools/WordFrequencyPanel'
import { fileBaseName, guessTextColumn } from '../lib/dataset'
import type { Dataset } from '../lib/dataset'

export default function FilterAndCount() {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [column, setColumn] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // The texts all four tools work on: the chosen column, one text per row.
  // This list is only rebuilt when the file or the column changes.
  const texts = useMemo(
    () => (dataset && column ? dataset.rows.map((row) => row[column] ?? '') : []),
    [dataset, column],
  )

  const hasText = texts.some((text) => text.trim() !== '')
  const ready = dataset !== null && hasText
  const fileBase = dataset ? fileBaseName(dataset.fileName) : 'data'

  const handleLoad = (loaded: Dataset) => {
    setDataset(loaded)
    setColumn(guessTextColumn(loaded.columns, loaded.rows))
  }

  const handleClear = () => {
    setDataset(null)
    setColumn('')
  }

  return (
    <>
      <Link className="back-link" to="/" state={{ scrollTo: 'groups' }}>
        ← All tool groups
      </Link>

      <header className="page-head">
        <h1>Filter and count</h1>
        <p className="lead">
          Upload a CSV, choose the text column, then run any tool below.
        </p>
      </header>

      <ol className="steps">
        <li className="step">
          <div className="step-head">
            <span className="step-number" aria-hidden="true">
              1
            </span>
            <h2>Upload your CSV</h2>
          </div>
          <UploadStep dataset={dataset} onLoad={handleLoad} onClear={handleClear} />
        </li>

        <li className={dataset ? 'step' : 'step step-locked'}>
          <div className="step-head">
            <span className="step-number" aria-hidden="true">
              2
            </span>
            <h2>Choose the column to analyse</h2>
          </div>
          {dataset ? (
            <ColumnStep dataset={dataset} column={column} onChange={setColumn} />
          ) : (
            <p className="muted">Available once a file is loaded.</p>
          )}
        </li>

        <li className={ready ? 'step' : 'step step-locked'}>
          <div className="step-head">
            <span className="step-number" aria-hidden="true">
              3
            </span>
            <h2>Run the tools</h2>
          </div>
          <div className="tool-stack">
            <HashtagsPanel texts={texts} ready={ready} fileBase={fileBase} />
            <EmojiPanel texts={texts} ready={ready} fileBase={fileBase} />
            <WordFrequencyPanel texts={texts} ready={ready} fileBase={fileBase} />
            <CountWordsPanel
              texts={texts}
              rows={dataset?.rows ?? []}
              ready={ready}
              fileBase={fileBase}
            />
          </div>
        </li>
      </ol>
    </>
  )
}
