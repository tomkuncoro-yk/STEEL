import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import Papa from 'papaparse'
import type { Dataset, Row } from '../lib/dataset'

// Step 1: choose or drop a CSV. The file is read by the browser and never uploaded.

type Props = {
  dataset: Dataset | null
  onLoad: (dataset: Dataset) => void
  onClear: () => void
}

export default function UploadStep({ dataset, onLoad, onClear }: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const readFile = (file: File) => {
    setMessage(null)
    setReading(true)

    Papa.parse<Row>(file, {
      header: true, // the first line holds the column names
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        setReading(false)
        const columns = (results.meta.fields ?? []).filter((name) => name !== '')
        if (columns.length === 0 || results.data.length === 0) {
          setMessage(
            'That file has no rows I can read. It should be a CSV with column names on the first line.',
          )
          return
        }
        const skippedRows = results.errors.filter((error) => error.type === 'FieldMismatch').length
        onLoad({ fileName: file.name, columns, rows: results.data, skippedRows })
      },
      error: (error) => {
        setReading(false)
        setMessage(`Could not read that file: ${error.message}`)
      },
    })
  }

  const handleChoose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) readFile(file)
    // Clearing the value lets the user pick the same file again later
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
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
              {dataset.rows.length.toLocaleString('en')} rows · {dataset.columns.length} columns
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
        <label
          className={dragging ? 'dropzone is-dragging' : 'dropzone'}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <span className="dropzone-title">
            {reading ? 'Reading the file…' : 'Drop a CSV here, or choose a file'}
          </span>
          <span className="metadata muted">
            Stays on your computer. Nothing is uploaded.
          </span>
          <span className="handwritten dropzone-note">start here</span>
        </label>
      )}

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/plain"
        onChange={handleChoose}
        aria-label="Choose a CSV file"
      />

      {message && (
        <p className="notice notice-error" role="alert">
          {message}
        </p>
      )}
    </div>
  )
}
