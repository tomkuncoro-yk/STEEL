import type { ReactNode } from 'react'
import type { CountRow } from '../lib/analysis'
import { downloadCsv } from '../lib/download'
import BarChart from './BarChart'

// Shows the result of one tool: a one-line summary, an optional chart, a table,
// and a button to download everything as CSV.

type Props = {
  summary: string
  rows: CountRow[] // all rows, already filtered by the panel's "minimum count"
  topN: number // how many rows to show on screen
  heading: string // name of the first column, e.g. "Hashtag"
  unit: string // what is being counted, e.g. "uses"
  downloadName: string // file name for the CSV
  emptyMessage: string
  showChart?: boolean
  bigLabels?: boolean // larger first column, for emoji
  actions?: ReactNode // extra buttons next to the CSV download
}

export default function ResultView({
  summary,
  rows,
  topN,
  heading,
  unit,
  downloadName,
  emptyMessage,
  showChart = false,
  bigLabels = false,
  actions,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="result">
        <p className="notice">{emptyMessage}</p>
        {actions}
      </div>
    )
  }

  const shown = rows.slice(0, topN)

  const saveCsv = () => {
    const table = rows.map((row) => ({
      [heading.toLowerCase()]: row.label,
      count: row.count,
      rows_containing: row.posts,
    }))
    // Protect formulas: some labels (typed terms) come from the user
    downloadCsv(downloadName, table, true)
  }

  return (
    <div className="result">
      <p className="result-summary">{summary}</p>

      {/* With a chart, the chart and its table sit side by side to save height */}
      <div className={showChart ? 'result-split' : undefined}>
        {showChart && <BarChart rows={shown} heading={heading} unit={unit} />}

        <div className="table-wrap">
          <table className="result-table">
            <caption className="sr-only">
              {heading} counts, top {shown.length}
            </caption>
            <thead>
              <tr>
                <th scope="col">{heading}</th>
                <th scope="col" className="num">
                  Count
                </th>
                <th scope="col" className="num">
                  In rows
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className={bigLabels ? 'big-label' : undefined}>
                    {row.label}
                  </th>
                  <td className="num">{row.count.toLocaleString('en')}</td>
                  <td className="num">{row.posts.toLocaleString('en')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rows.length > shown.length && (
        <p className="metadata muted">
          Showing the top {shown.length.toLocaleString('en')} of {rows.length.toLocaleString('en')}.
          The CSV has all of them.
        </p>
      )}

      <div className="result-actions">
        <button type="button" className="pill pill-outline" onClick={saveCsv}>
          Download all {rows.length.toLocaleString('en')} rows (CSV)
        </button>
        {actions}
      </div>
    </div>
  )
}
