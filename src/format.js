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
