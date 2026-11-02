import { useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import Papa from 'papaparse'
import type { Dataset, Row } from '../lib/dataset'
import { SelectField } from './fields'

// Step 1: choose or drop a CSV, or paste text. It is read by the browser and never uploaded.

type Props = {
  dataset: Dataset | null
  onLoad: (dataset: Dataset) => void
  onClear: () => void
}

const pasteModes = [
  { value: 'lines', label: 'One post per line' },
  { value: 'csv', label: 'CSV (column names on the first line)' },
]

export default function UploadStep({ dataset, onLoad, onClear }: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pasted, setPasted] = useState('')
  const [pasteMode, setPasteMode] = useState('lines')
  const inputRef = useRef<HTMLInputElement>(null)
  const pasteId = useId()

  // Turns what the CSV reader found into a dataset, or explains why it cannot
  const finishParsing = (results: Papa.ParseResult<Row>, name: string) => {
    setReading(false)
    const columns = (results.meta.fields ?? []).filter((column) => column !== '')
    if (columns.length === 0 || results.data.length === 0) {
      setMessage(
        'That has no rows I can read. It should be a CSV with column names on the first line.',
      )
      return
    }
    const skippedRows = results.errors.filter((error) => error.type === 'FieldMismatch').length
    onLoad({ fileName: name, columns, rows: results.data, skippedRows })
  }

  const readFile = (file: File) => {
    setMessage(null)
    setReading(true)

    Papa.parse<Row>(file, {
      header: true, // the first line holds the column names
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => finishParsing(results, file.name),
      error: (error) => {
        setReading(false)
        setMessage(`Could not read that file: ${error.message}`)
      },
    })
  }

  const usePastedText = () => {
    setMessage(null)

    if (pasteMode === 'csv') {
      const results = Papa.parse<Row>(pasted, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim(),
      })
      finishParsing(results, 'pasted-text')
      return
    }

    // One post per line: every non-empty line becomes a row in a single "text" column
    const lines = pasted
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== '')
    if (lines.length === 0) {
      setMessage('Paste some text first.')
      return
    }
    onLoad({
      fileName: 'pasted-text',
      columns: ['text'],
      rows: lines.map((line) => ({ text: line })),
      skippedRows: 0,
    })
  }

  const handleChoose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) readFile(file)
    // Clearing the value lets the user pick the same file again later
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) readFile(file)
  }

  const handleClear = () => {
    setMessage(null)
    onClear()
  }

  return (
    <div className="upload">
      {dataset ? (
        <div className="file-card">
          <div>
            <p className="card-title">{dataset.fileName}</p>
            <p className="metadata muted">
              {dataset.rows.length.toLocaleString('en')} rows · {dataset.columns.length}{' '}
              {dataset.columns.length === 1 ? 'column' : 'columns'}
            </p>
            {dataset.skippedRows > 0 && (
              <p className="metadata muted">
                {dataset.skippedRows.toLocaleString('en')} rows had a different number of fields
                than the header. They were still read.
              </p>
            )}
          </div>
          <div className="file-card-actions">
            <button
              type="button"
              className="pill pill-outline"
              onClick={() => inputRef.current?.click()}
            >
              Choose another file
            </button>
            <button type="button" className="pill pill-outline" onClick={handleClear}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={dragging ? 'dropzone is-dragging' : 'dropzone'}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <span className="dropzone-title">
            {reading ? 'Reading the file…' : 'Drop a CSV here, or'}
          </span>
          {/* Opens the computer's file explorer */}
          <button
            type="button"
            className="pill pill-solid"
            onClick={() => inputRef.current?.click()}
            disabled={reading}
          >
            Choose a file
          </button>
          <span className="metadata muted">Stays on your computer. Nothing is uploaded.</span>
          <span className="handwritten dropzone-note">start here</span>
        </div>
      )}

      {/* Hidden: the buttons above open it. Kept out of the Tab order. */}
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/plain"
        onChange={handleChoose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <details className="paste">
        <summary>Or paste text instead</summary>
        <div className="paste-body">
          <div className="field">
            <label htmlFor={pasteId}>Text to analyse</label>
            <textarea
              id={pasteId}
              rows={5}
              value={pasted}
              onChange={(event) => setPasted(event.target.value)}
              placeholder="Paste your posts here"
            />
          </div>
          <div className="paste-actions">
            <SelectField
              label="How is it laid out?"
              value={pasteMode}
              onChange={setPasteMode}
              options={pasteModes}
            />
            <button
              type="button"
              className="pill pill-solid"
              onClick={usePastedText}
              disabled={pasted.trim() === ''}
            >
              Use this text
            </button>
          </div>
        </div>
      </details>

      {message && (
        <p className="notice notice-error" role="alert">
          {message}
        </p>
      )}
    </div>
  )
}
