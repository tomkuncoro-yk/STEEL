import type { CountRow } from '../lib/analysis'

// Horizontal bar chart for one series, built from plain HTML so the text stays crisp
// and selectable. The table under it carries the same numbers, so the chart is never
// the only way to read a value.

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

// Under 10,000 show the full number; above that, 10K, 1.2M
function formatTick(value: number): string {
  return value >= 10000 ? compact.format(value) : value.toLocaleString('en')
}

type Props = {
  rows: CountRow[]
  heading: string // e.g. "Word"
  unit: string // e.g. "uses"
}

export default function BarChart({ rows, heading, unit }: Props) {
  const max = Math.max(...rows.map((row) => row.count), 1)

  // Pick a round step (1, 2, 5, 10, 20, 50 ...) so the axis ends on a clean number
  const rawStep = max / 4
  const power = 10 ** Math.floor(Math.log10(rawStep))
  const normal = rawStep / power
  const step = Math.max(1, (normal <= 1 ? 1 : normal <= 2 ? 2 : normal <= 5 ? 5 : 10) * power)
  const intervals = Math.ceil(max / step)
  const axisMax = intervals * step
  const ticks = Array.from({ length: intervals + 1 }, (_, index) => index * step)

  return (
    <figure className="bar-chart">
      <figcaption className="metadata muted">
        {heading}: top {rows.length} by number of {unit}
      </figcaption>

      <ul className="bar-list" style={{ ['--intervals' as string]: intervals }}>
        {rows.map((row) => {
          const share = (row.count / axisMax) * 100
          return (
            <li
              className="bar-row"
              key={row.label}
              tabIndex={0}
              data-flip={share > 60}
              style={{ ['--share' as string]: `${share}%` }}
            >
              <span className="bar-label" title={row.label}>
                {row.label}
              </span>
              <span className="bar-track">
                <span className="bar" />
                <span className="bar-value">{row.count.toLocaleString('en')}</span>
                <span className="bar-tip">
                  <strong>{row.count.toLocaleString('en')}</strong> {row.label}
                  <span className="bar-tip-detail">
                    in {row.posts.toLocaleString('en')} {row.posts === 1 ? 'row' : 'rows'}
                  </span>
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="bar-axis" aria-hidden="true">
        <span />
        <span className="bar-axis-ticks">
          {ticks.map((tick) => (
            <span key={tick} style={{ left: `${(tick / axisMax) * 100}%` }}>
              {formatTick(tick)}
            </span>
          ))}
        </span>
      </div>
    </figure>
  )
}
