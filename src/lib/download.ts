import Papa from 'papaparse'

// Saves a list of rows as a CSV file in the user's Downloads folder.
// Nothing is sent anywhere: the file is built in the browser.
//
// protectFormulas: spreadsheets treat cells starting with = + - @ as formulas.
// Turn this on for results that contain text typed by the user, so a term like
// "=HYPERLINK(...)" cannot run when the CSV is opened. Leave it off when exporting
// the user's own rows, which must come back unchanged.
export function downloadCsv(
  fileName: string,
  rows: Record<string, unknown>[],
  protectFormulas: boolean,
) {
  const csv = Papa.unparse(rows, { escapeFormulae: protectFormulas })
  // The BOM (﻿) makes Excel read the file as UTF-8, so emoji and accents survive
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
