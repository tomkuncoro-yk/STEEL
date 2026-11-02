import { useId } from 'react'
import type { ReactNode } from 'react'

// Small form controls shared by all the tool panels.
// Each one creates its own unique id, so a label is always tied to its input.

type NumberFieldProps = {
  label: string
  value: string // kept as text while typing, turned into a number by the panel
  onChange: (value: string) => void
  min: number
  max: number
  hint?: string
}

export function NumberField({ label, value, onChange, min, max, hint }: NumberFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

type CheckFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}

export function CheckField({ label, checked, onChange, hint }: CheckFieldProps) {
  const id = useId()
  return (
    <div className="field field-check">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>
        {label}
        {hint && <span className="field-hint">{hint}</span>}
      </label>
    </div>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  const id = useId()
  return (
    <div className="field field-select">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

type FieldGroupProps = { children: ReactNode }

// Lays settings out in a tidy row that wraps on small screens
export function FieldGroup({ children }: FieldGroupProps) {
  return <div className="field-group">{children}</div>
}
