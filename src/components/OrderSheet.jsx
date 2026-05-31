import Brand from './Brand.jsx'
import { money, qty, jobNoLabel } from '../format.js'

// The deliverable: a clean, grouped order sheet. "Print" uses the browser's
// print-to-PDF; "Download CSV" writes a grouped spreadsheet.
export default function OrderSheet({ job, takeoff, showSource }) {
  const { totals, components } = takeoff

  return (
    <div>
      {/* Toolbar — hidden when printing */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Order sheet rounds every item up to its real purchase unit and shows what's left over.
        </p>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(job, takeoff)} className="rounded-lg border border-wf-blue px-4 py-2 text-sm font-semibold text-wf-blue hover:bg-wf-pale">
            Download CSV
          </button>
          <button onClick={() => window.print()} className="rounded-lg bg-wf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-wf-navy">
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div className="print-area rounded-xl border border-wf-line bg-white p-6 shadow-sm sm:p-8">
        <header className="flex items-start justify-between border-b-2 border-wf-navy pb-4">
          <div>
            <Brand />
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Materials Order Sheet</p>
          </div>
          <div className="max-w-[50%] text-right text-sm">
            <div className="text-lg font-bold text-wf-navy">{job.name || 'Untitled job'}</div>
            <div className="text-slate-600">{job.customer || '—'}</div>
            <div className="text-xs text-slate-500">{jobNoLabel(job.jobNumber)} · Rev {job.version} · {job.date}</div>
            <div className="mt-1 text-xs text-slate-400">
              {components.map((c) => c.comp.label).join(' · ')}
            </div>
          </div>
        </header>

        {takeoff.categories.map((cat) => (
          <section key={cat.name} className="mt-5 break-inside-avoid">
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-wf-blue">{cat.name}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-wf-line text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="py-1.5 pr-2 font-semibold">Item</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Needed</th>
                  <th className="py-1.5 px-2 text-left font-semibold">Purchase unit</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Order</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Unit $</th>
                  <th className="py-1.5 px-2 text-right font-semibold">Line $</th>
                  <th className="py-1.5 pl-2 text-right font-semibold">Leftover</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((it) => (
                  <tr key={it.key} className="border-b border-wf-line/50">
                    <td className="py-1.5 pr-2">
                      <span className="font-medium text-wf-navy">{it.name}</span>
                      {showSource && <span className="ml-1 text-[10px] text-slate-400">· {it.sourceLabel}</span>}
                      {it.overridden && <span className="ml-1 text-[10px] text-amber-600">(edited)</span>}
                    </td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">{qty(it.qtyNeeded)} {it.unit}</td>
                    <td className="py-1.5 px-2 text-slate-600">{it.purchaseUnit}</td>
                    <td className="py-1.5 px-2 text-right font-semibold tabular-nums text-wf-navy">{it.qtyToOrder}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">{money(it.unitPrice)}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-wf-navy">{money(it.lineCost)}</td>
                    <td className="py-1.5 pl-2 text-right tabular-nums text-slate-500">
                      {it.expectedLeftover > 0 ? `${qty(it.expectedLeftover)} ${it.unit}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <footer className="mt-6 flex flex-col gap-3 border-t-2 border-wf-navy pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span className="font-semibold">Estimated leftover: {money(totals.leftoverValue)}</span> — return
            or carry to the next job.
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-slate-500">Estimated material cost</div>
            <div className="text-3xl font-bold tabular-nums text-wf-navy">{money(totals.materialCost)}</div>
          </div>
        </footer>

        <p className="mt-4 text-[10px] text-slate-400">
          Estimate only. Quantities use seeded defaults until confirmed with the supplier's real
          numbers. Waterfront Solutions · West Michigan deck &amp; stair builders.
        </p>
      </div>
    </div>
  )
}

// ---- CSV export ----------------------------------------------------------
function downloadCSV(job, takeoff) {
  const rows = [
    ['Category', 'Item', 'Component', 'Qty Needed', 'Unit', 'Purchase Unit', 'Qty to Order', 'Unit Price', 'Line Cost', 'Est. Leftover', 'Leftover $'],
  ]
  for (const cat of takeoff.categories) {
    for (const it of cat.items) {
      rows.push([
        cat.name, it.name, it.sourceLabel, qty(it.qtyNeeded), it.unit, it.purchaseUnit,
        it.qtyToOrder, it.unitPrice, it.lineCost, qty(it.expectedLeftover), it.leftoverValue,
      ])
    }
  }
  rows.push([])
  rows.push(['', '', '', '', '', '', '', '', 'Material total', '', takeoff.totals.materialCost])
  rows.push(['', '', '', '', '', '', '', '', 'Leftover total', '', takeoff.totals.leftoverValue])

  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(job.name || 'order-sheet').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-order.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function csvCell(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
