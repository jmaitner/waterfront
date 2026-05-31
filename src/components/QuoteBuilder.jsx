import { computeQuote, seedQuoteLines, resyncCosts, defaultQuote } from '../quote.js'
import { computeLabor } from '../labor.js'
import { inputCls } from './ui.jsx'
import { money } from '../format.js'
import CustomerQuote from './CustomerQuote.jsx'

// Step 4. Asks whether to build a customer-facing quote; if yes, turns material
// COST into customer PRICE via markup/margin, with editable lines, and shows a
// live preview of exactly what the customer will see.
export default function QuoteBuilder({ job, takeoff, config, onChange }) {
  const quote = job.quote || defaultQuote()
  const laborTotal = computeLabor(job.labor, config).total

  // ---- the yes / no gate ----
  if (!quote.enabled) {
    return (
      <div className="rounded-xl border border-wf-line bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-bold text-wf-navy">Create a customer-facing quote?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Turn this materials takeoff into a priced quote you can send the customer — add your
          markup or margin, drop in labor, and print a clean branded proposal. Your internal
          materials order sheet stays separate.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            onClick={() => onChange({ ...defaultQuote(), enabled: true, seeded: true, lines: seedQuoteLines(takeoff, laborTotal) })}
            className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy"
          >
            Yes, build a quote
          </button>
          <button className="rounded-lg border border-wf-line px-6 py-2.5 font-semibold text-slate-500" disabled>
            No, materials only
          </button>
        </div>
      </div>
    )
  }

  const quoted = computeQuote(quote, takeoff)
  const set = (patch) => onChange({ ...quote, ...patch })
  const updateLine = (id, patch) => set({ lines: quote.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) })
  const removeLine = (id) => set({ lines: quote.lines.filter((l) => l.id !== id) })
  const addLine = () =>
    set({ lines: [...quote.lines, { id: `ql_custom_${quote.lines.length}_${Math.floor(Math.random() * 1e5)}`, label: '', cost: 0, componentId: null, priceOverride: null }] })

  return (
    <div className="space-y-6">
      {/* ---- Pricing editor (internal, hidden from print) ---- */}
      <div className="no-print space-y-4 rounded-xl border border-wf-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-wf-blue">Pricing</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => set(resyncCosts(quote, takeoff, laborTotal))} className="rounded-lg border border-wf-line px-3 py-1.5 text-xs font-medium text-wf-navy hover:bg-wf-pale">
              Re-sync material + labor
            </button>
            <button onClick={() => set({ enabled: false })} className="rounded-lg border border-wf-line px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-wf-pale">
              Disable quote
            </button>
          </div>
        </div>

        {/* markup / margin controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <div className="mb-1 text-sm font-medium text-wf-navy">Method</div>
            <div className="inline-flex overflow-hidden rounded-lg border border-wf-line">
              {['markup', 'margin'].map((m) => (
                <button key={m} onClick={() => set({ mode: m })}
                  className={`px-4 py-2 text-sm font-semibold capitalize ${quote.mode === m ? 'bg-wf-blue text-white' : 'bg-white text-wf-navy'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <div className="mb-1 text-sm font-medium text-wf-navy">{quote.mode === 'margin' ? 'Margin' : 'Markup'} %</div>
            <input type="number" min="0" step="1" value={quote.percent} onChange={(e) => set({ percent: e.target.value })} className={`${inputCls} w-28`} />
          </label>
          <label className="block">
            <div className="mb-1 text-sm font-medium text-wf-navy">Tax %</div>
            <input type="number" min="0" step="0.1" value={quote.taxPct} onChange={(e) => set({ taxPct: e.target.value })} className={`${inputCls} w-24`} />
          </label>
          <label className="block">
            <div className="mb-1 text-sm font-medium text-wf-navy">Valid (days)</div>
            <input type="number" min="0" step="1" value={quote.validDays} onChange={(e) => set({ validDays: e.target.value })} className={`${inputCls} w-24`} />
          </label>
        </div>

        {/* line editor */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-wf-line text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2 font-semibold">Line item</th>
                <th className="px-2 py-2 text-right font-semibold">Cost</th>
                <th className="px-2 py-2 text-right font-semibold">Price</th>
                <th className="px-2 py-2 text-right font-semibold">Margin</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {quoted.lines.map((l) => (
                <tr key={l.id} className="border-b border-wf-line/60">
                  <td className="px-2 py-1.5">
                    <input value={l.label} placeholder="Line item" onChange={(e) => updateLine(l.id, { label: e.target.value })} className={inputCls} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" min="0" step="0.01" value={l.cost} onChange={(e) => updateLine(l.id, { cost: e.target.value })} className={`${inputCls} w-28 text-right tabular-nums`} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number" min="0" step="0.01"
                      value={l.overridden ? l.priceOverride : l.price}
                      onChange={(e) => updateLine(l.id, { priceOverride: e.target.value })}
                      className={`w-28 rounded-lg border px-3 py-2 text-right tabular-nums outline-none focus:ring-2 focus:ring-wf-sky/40 ${l.overridden ? 'border-amber-400 bg-amber-50 font-semibold' : 'border-wf-line bg-white'}`}
                    />
                    {l.overridden && (
                      <button onClick={() => updateLine(l.id, { priceOverride: null })} className="mt-0.5 block text-[10px] text-amber-600 hover:underline">
                        auto {money(l.autoPrice)}
                      </button>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums text-slate-500">{money(l.margin)}</td>
                  <td className="px-2 py-1.5 text-right"><button onClick={() => removeLine(l.id)} className="text-slate-400 hover:text-red-500">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addLine} className="rounded-lg border border-wf-blue px-4 py-2 text-sm font-semibold text-wf-blue hover:bg-wf-pale">
          + Add line (labor, permits, demo…)
        </button>

        <label className="block">
          <div className="mb-1 text-sm font-medium text-wf-navy">Notes shown on the quote</div>
          <textarea value={quote.notes} onChange={(e) => set({ notes: e.target.value })} rows={2} placeholder="Scope notes, exclusions, timeline…" className={inputCls} />
        </label>

        {/* internal margin summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Material + line cost" value={money(quoted.totalCost)} />
          <Stat label="Quote subtotal" value={money(quoted.subtotal)} />
          <Stat label="Your margin" value={money(quoted.totalMargin)} accent />
          <Stat label="Margin %" value={`${quoted.marginPct}%`} accent />
        </div>
      </div>

      {/* ---- Live customer preview (this is what prints) ---- */}
      <div>
        <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-wf-blue">Customer sees</h3>
          <div className="flex gap-2">
            <button onClick={() => downloadQuoteCSV(job, quoted)} className="rounded-lg border border-wf-blue px-4 py-2 text-sm font-semibold text-wf-blue hover:bg-wf-pale">
              Download CSV
            </button>
            <button onClick={() => window.print()} className="rounded-lg bg-wf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-wf-navy">
              Print / Save PDF
            </button>
          </div>
        </div>
        <CustomerQuote job={job} quoted={quoted} />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-3 shadow-sm ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-wf-line bg-white'}`}>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-xl font-bold tabular-nums ${accent ? 'text-emerald-700' : 'text-wf-navy'}`}>{value}</div>
    </div>
  )
}

function downloadQuoteCSV(job, quoted) {
  const rows = [['Description', 'Amount']]
  quoted.lines.forEach((l) => rows.push([l.label, l.price]))
  rows.push([])
  rows.push(['Subtotal', quoted.subtotal])
  if (quoted.tax > 0) rows.push([`Tax (${job.quote.taxPct}%)`, quoted.tax])
  rows.push(['Total', quoted.total])
  const csv = rows.map((r) => r.map((c) => (/[",\n]/.test(String(c ?? '')) ? `"${String(c).replace(/"/g, '""')}"` : String(c ?? ''))).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(job.name || 'quote').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-quote.csv`
  a.click()
  URL.revokeObjectURL(url)
}
