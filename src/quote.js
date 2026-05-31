// ============================================================================
// Customer-facing quote logic
// ============================================================================
// The materials engine (materialRules.js) gives us COST. A quote turns cost into
// a customer PRICE by applying markup or margin, plus any hand-added lines
// (labor, permits, demo). The customer never sees cost or margin — only prices.
// ============================================================================

export const DEFAULT_MARKUP_PCT = 35 // PLACEHOLDER — typical materials markup

export function defaultQuote() {
  return {
    enabled: false,
    seeded: false,
    mode: 'markup', // 'markup' (price = cost × (1+p)) | 'margin' (price = cost ÷ (1−p))
    percent: DEFAULT_MARKUP_PCT,
    taxPct: 0,
    validDays: 30,
    notes: '',
    lines: [],
  }
}

// Seed one quote line per component (its material subtotal) + a labor line to
// fill in. Lines tied to a component carry componentId so we can re-sync costs.
export function seedQuoteLines(takeoff) {
  const lines = takeoff.components
    .filter((c) => c.items.length > 0)
    .map((c) => ({
      id: `ql_${c.comp.id}`,
      label: `${c.comp.label} — materials`,
      cost: round2(sum(c.items.map((i) => i.lineCost))),
      componentId: c.comp.id,
      priceOverride: null,
    }))
  lines.push({ id: 'ql_labor', label: 'Labor & installation', cost: 0, componentId: null, priceOverride: null })
  return lines
}

// Refresh material-derived line costs from the current takeoff (after the job
// was edited), leaving hand-added lines and price overrides untouched.
export function resyncCosts(quote, takeoff) {
  const byComp = {}
  for (const c of takeoff.components) byComp[c.comp.id] = round2(sum(c.items.map((i) => i.lineCost)))
  return {
    ...quote,
    lines: quote.lines.map((l) =>
      l.componentId && byComp[l.componentId] != null ? { ...l, cost: byComp[l.componentId] } : l,
    ),
  }
}

export function autoPrice(cost, mode, percent) {
  const p = num(percent)
  if (mode === 'margin') {
    const m = Math.min(99.9, Math.max(0, p)) // guard divide-by-zero / negative
    return round2(cost / (1 - m / 100))
  }
  return round2(cost * (1 + p / 100))
}

// Full quote roll-up: per-line price + margin, then subtotal / tax / total and
// the internal margin figures.
export function computeQuote(quote, takeoff) {
  const lines = (quote.lines || []).map((l) => {
    const cost = num(l.cost)
    const auto = autoPrice(cost, quote.mode, quote.percent)
    const hasOverride = l.priceOverride !== null && l.priceOverride !== undefined && l.priceOverride !== ''
    const price = hasOverride ? round2(num(l.priceOverride)) : auto
    return { ...l, cost, autoPrice: auto, price, margin: round2(price - cost), overridden: hasOverride }
  })
  const subtotal = round2(sum(lines.map((l) => l.price)))
  const totalCost = round2(sum(lines.map((l) => l.cost)))
  const tax = round2((subtotal * num(quote.taxPct)) / 100)
  const total = round2(subtotal + tax)
  const totalMargin = round2(subtotal - totalCost)
  const marginPct = subtotal > 0 ? round2((totalMargin / subtotal) * 100) : 0
  return { lines, subtotal, totalCost, tax, total, totalMargin, marginPct }
}

function sum(arr) {
  return arr.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0)
}
function num(v) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
function round2(n) {
  return Math.round(n * 100) / 100
}
