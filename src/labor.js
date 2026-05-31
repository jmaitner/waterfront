// ============================================================================
// Labor estimation
// ============================================================================
// Labor is its own cost step: a list of tasks, each with estimated hours × a
// crew rate. The total flows into the customer quote as a cost line. Hours are
// the estimate; the rate defaults to the company rate in Materials & Pricing
// but can be overridden per line (e.g. a sub at a different rate).
// ============================================================================

export function defaultLabor() {
  return { lines: [], note: '' }
}

// One labor line per component, hours blank for the estimator to fill in.
export function seedLaborLines(takeoff, rate) {
  return takeoff.components
    .filter((c) => c.items.length > 0)
    .map((c) => ({ id: `lb_${c.comp.id}`, task: c.comp.label, hours: 0, rate }))
}

export function computeLabor(labor, cfg) {
  const baseRate = num(cfg.laborRatePerHr)
  const lines = (labor?.lines || []).map((l) => {
    const hours = num(l.hours)
    const rate = l.rate !== undefined && l.rate !== null && l.rate !== '' ? num(l.rate) : baseRate
    return { ...l, hours, rate, cost: round2(hours * rate) }
  })
  const totalHours = round2(sum(lines.map((l) => l.hours)))
  const total = round2(sum(lines.map((l) => l.cost)))
  return { lines, totalHours, total }
}

function sum(a) {
  return a.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0)
}
function num(v) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
function round2(n) {
  return Math.round(n * 100) / 100
}
