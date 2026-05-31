// Display helpers shared across the UI.
export function money(n) {
  const v = Number.isFinite(n) ? n : 0
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

export function qty(n) {
  const v = Number.isFinite(n) ? n : 0
  // Whole numbers show clean; fractional needs (e.g. sq ft) show one decimal.
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function nowISO() {
  return new Date().toISOString()
}

export function jobNoLabel(n) {
  return n ? `WF-${n}` : 'WF-—'
}

// Add days to a YYYY-MM-DD string, returning YYYY-MM-DD.
export function addDaysISO(dateStr, days) {
  const d = new Date(`${dateStr || todayISO()}T00:00:00`)
  const n = parseInt(days, 10)
  d.setDate(d.getDate() + (Number.isFinite(n) ? n : 0))
  return d.toISOString().slice(0, 10)
}
