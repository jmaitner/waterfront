import { money, qty } from '../format.js'

// Editable parts list. The user can override any "Qty to Order" and it persists
// on the job; everything (leftover, line cost, totals) recomputes live.
export default function ReviewTable({ takeoff, onOverride, onResetAll, hasOverrides }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Tap any <span className="font-semibold text-wf-navy">Qty to Order</span> to override the
          calculated number. Overrides are saved with this job.
        </p>
        {hasOverrides && (
          <button onClick={onResetAll} className="text-sm font-medium text-wf-blue hover:underline">
            Reset all to calculated
          </button>
        )}
      </div>

      {takeoff.categories.map((cat) => (
        <div key={cat.name} className="overflow-hidden rounded-xl border border-wf-line bg-white shadow-sm">
          <div className="bg-wf-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
            {cat.name}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-wf-line text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Needed</th>
                  <th className="px-3 py-2 text-left font-semibold">Purchase unit</th>
                  <th className="px-3 py-2 text-center font-semibold">Qty to order</th>
                  <th className="px-3 py-2 text-right font-semibold">Leftover</th>
                  <th className="px-4 py-2 text-right font-semibold">Line cost</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((it) => (
                  <tr key={it.id} className="border-b border-wf-line/60 last:border-0 align-top">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-wf-navy">{it.name}</div>
                      {it.note && <div className="text-xs text-slate-400">{it.note}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                      {qty(it.qtyNeeded)} <span className="text-xs text-slate-400">{it.unit}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{it.purchaseUnit}</td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        value={it.qtyToOrder}
                        onChange={(e) => onOverride(it.id, e.target.value)}
                        className={`w-20 rounded-lg border px-2 py-1 text-center tabular-nums outline-none focus:ring-2 focus:ring-wf-sky/40 ${
                          it.overridden
                            ? 'border-amber-400 bg-amber-50 font-semibold'
                            : 'border-wf-line bg-white'
                        }`}
                      />
                      {it.overridden && (
                        <div className="mt-0.5 text-[10px] text-amber-600">calc {it.baseOrder}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className={it.expectedLeftover > 0 ? 'text-slate-600' : 'text-slate-300'}>
                        {qty(it.expectedLeftover)} {it.expectedLeftover > 0 ? it.unit : ''}
                      </span>
                      {it.leftoverValue > 0 && (
                        <div className="text-[10px] text-amber-600">{money(it.leftoverValue)}</div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums text-wf-navy">
                      {money(it.lineCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <TotalsBar takeoff={takeoff} />
    </div>
  )
}

function TotalsBar({ takeoff }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Stat label="Items on list" value={takeoff.totals.itemCount} />
      <Stat label="Estimated material cost" value={money(takeoff.totals.materialCost)} strong />
      <Stat label="Estimated leftover value" value={money(takeoff.totals.leftoverValue)} amber />
    </div>
  )
}

function Stat({ label, value, strong, amber }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${amber ? 'border-amber-200 bg-amber-50' : 'border-wf-line bg-white'}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${amber ? 'text-amber-700' : 'text-wf-navy'} ${strong ? '' : ''}`}>
        {value}
      </div>
    </div>
  )
}
