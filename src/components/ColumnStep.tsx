import { useId, useMemo } from 'react'
import type { Dataset } from '../lib/dataset'

// Step 2: choose which column holds the text to analyse.
// A few example values are shown so the user can confirm it is the right one.

type Props = {
  dataset: Dataset
  column: string
  onChange: (column: string) => void
}

export default function ColumnStep({ dataset, column, onChange }: Props) {
  const selectId = useId()

  const { samples, withText } = useMemo(() => {
    const found: string[] = []
    let count = 0
    for (const row of dataset.rows) {
      const value = (row[column] ?? '').trim()
      if (value === '') continue
      count += 1
      if (found.length < 3) found.push(value)
    }
    return { samples: found, withText: count }
  }, [dataset, column])

  return (
    <div className="column-step">
      <div className="field">
        <label htmlFor={selectId}>Column with the text</label>
        <select id={selectId} value={column} onChange={(event) => onChange(event.target.value)}>
          {dataset.columns.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {withText === 0 ? (
        <p className="notice notice-error" role="alert">
          This column is empty. Choose another one.
        </p>
      ) : (
        <>
          <p className="metadata muted">
            {withText.toLocaleString('en')} of {dataset.rows.length.toLocaleString('en')} rows have
            text in this column. First examples:
          </p>
          <ul className="samples">
            {samples.map((sample, index) => (
              <li key={index}>{sample.length > 180 ? sample.slice(0, 180) + '…' : sample}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
