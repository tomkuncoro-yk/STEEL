// A CSV file after it has been read: column names plus one object per row.
export type Row = Record<string, string>

export type Dataset = {
  fileName: string
  columns: string[]
  rows: Row[]
  skippedRows: number // rows that had a different number of fields than the header
}

// "tweets_2024.csv" becomes "tweets_2024", used to name downloaded files
export function fileBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '') || 'data'
}

// Whole numbers typed into a form field: out-of-range values are pulled back in range
export function parseWholeNumber(text: string, min: number, max: number, fallback: number): number {
  const value = Number.parseInt(text, 10)
  if (Number.isNaN(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

// Picks the column most likely to hold the text, so the user usually only has to confirm it.
// 1) a column with a typical name, 2) otherwise the column with the longest values.
export function guessTextColumn(columns: string[], rows: Row[]): string {
  const typicalNames = [
    'full_text', 'text', 'tweet', 'content', 'body', 'message', 'post',
    'caption', 'comment', 'description', 'title',
  ]
  for (const name of typicalNames) {
    const found = columns.find((column) => column.toLowerCase() === name)
    if (found) return found
  }

  let best = columns[0] ?? ''
  let bestLength = -1
  const sample = rows.slice(0, 200)
  for (const column of columns) {
    let total = 0
    for (const row of sample) total += (row[column] ?? '').length
    if (total > bestLength) {
      bestLength = total
      best = column
    }
  }
  return best
}
