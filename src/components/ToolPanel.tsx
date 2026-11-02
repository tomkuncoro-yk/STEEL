import { useId } from 'react'
import type { ReactNode } from 'react'

// The frame every tool sits in: title, settings, a "Show results" button, results.
// The tool itself decides what the settings and results look like.

type Props = {
  title: string
  description: string
  ready: boolean // false until a file and a column are chosen (locks the settings)
  canRun?: boolean // false when the tool still needs input, e.g. no words typed yet
  running: boolean
  hasResult: boolean
  stale: boolean // true when a setting changed after the last run
  onRun: () => void
  settings: ReactNode
  children?: ReactNode // the results
}

export default function ToolPanel({
  title,
  description,
  ready,
  canRun = ready,
  running,
  hasResult,
  stale,
  onRun,
  settings,
  children,
}: Props) {
  const titleId = useId()

  return (
    <section className="tool-panel" aria-labelledby={titleId}>
      <div className="tool-panel-head">
        <h3 id={titleId}>{title}</h3>
        <p className="muted">{description}</p>
      </div>

      <div className="tool-controls">
        <fieldset className="settings" disabled={!ready}>
          <legend className="sr-only">Settings</legend>
          {settings}
        </fieldset>

        <div className="tool-actions">
          <button
            type="button"
            className="pill pill-solid"
            onClick={onRun}
            disabled={!canRun || running}
          >
            {running ? 'Working…' : hasResult ? 'Update results' : 'Show results'}
          </button>
          {!ready && <span className="metadata muted">Choose a file and a column first.</span>}
          {ready && stale && <span className="metadata">Settings changed. Press to update.</span>}
        </div>
      </div>

      <div className="tool-results" aria-live="polite">
        {children}
      </div>
    </section>
  )
}
