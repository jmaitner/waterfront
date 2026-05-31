import { money, qty } from '../format.js'
import { ComponentEditor } from './ComponentEditors.jsx'

// Editable, combined parts list. Every computed item's Qty to Order AND Unit
// price can be overridden, and any item can be removed — all saved on the job
// and recomputed live. Below the tables you can add custom items by hand.
export default function ReviewTable({ takeoff, onOverride, onResetAll, hasOverrides, showSource, extras, onExtrasChange }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Edit any <span className="font-semibold text-wf-navy">Qty</span> or{' '}
          <span className="font-semibold text-wf-navy">Unit $</span>, or remove a line. Add your own
          items below. Everything is saved with this job.
        </p>
        {hasOverrides && (
          <button onClick={onResetAll} className="shrink-0 text-sm font-medium text-wf-blue hover:underline">
            Reset to calculated
          </button>
        )}
      </div>

      {takeoff.categories.map((cat) => (
        <div key={cat.name} className="overflow-hidden rounded-xl border border-wf-line bg-white shadow-sm">
          <div className="bg-wf-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">{cat.name}</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-wf-line text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Needed</th>
                  <th className="px-3 py-2 text-left font-semibold">Purchase unit</th>
                  <th className="px-3 py-2 text-center font-semibold">Qty to order</th>
                  <th className="px-3 py-2 text-center font-semibold">Unit $</th>
                  <th className="px-3 py-2 text-right font-semibold">Leftover</th>
                  <th className="px-4 py-2 text-right font-semibold">Line cost</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((it) => (
                  <tr key={it.key} className="border-b border-wf-line/60 last:border-0 align-top">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-wf-navy">
                        {it.name}
                        {showSource && <span className="ml-2 rounded bg-wf-pale px-1.5 py-0.5 text-[10px] font-normal text-wf-blue">{it.sourceLabel}</span>}
                      </div>
                      {it.note && <div className="text-xs text-slate-400">{it.note}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                      {qty(it.qtyNeeded)} <span className="text-xs text-slate-400">{it.unit}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{it.purchaseUnit}</td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="number" min="0" value={it.qtyToOrder}
                        onChange={(e) => onOverride(it.componentId, it.id, { qtyToOrder: e.target.value })}
                        className={`w-20 rounded-lg border px-2 py-1 text-center tabular-nums outline-none focus:ring-2 focus:ring-wf-sky/40 ${it.qtyOverridden ? 'border-amber-400 bg-amber-50 font-semibold' : 'border-wf-line bg-white'}`}
                      />
                      {it.qtyOverridden && <div className="mt-0.5 text-[10px] text-amber-600">calc {it.baseOrder}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="number" min="0" step="0.01" value={it.unitPrice}
                        onChange={(e) => onOverride(it.componentId, it.id, { unitPrice: e.target.value })}
                        className={`w-24 rounded-lg border px-2 py-1 text-right tabular-nums outline-none focus:ring-2 focus:ring-wf-sky/40 ${it.priceOverridden ? 'border-amber-400 bg-amber-50 font-semibold' : 'border-wf-line bg-white'}`}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className={it.expectedLeftover > 0 ? 'text-slate-600' : 'text-slate-300'}>
                        {qty(it.expectedLeftover)} {it.expectedLeftover > 0 ? it.unit : ''}
                      </span>
                      {it.leftoverValue > 0 && <div className="text-[10px] text-amber-600">{money(it.leftoverValue)}</div>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums text-wf-navy">{money(it.lineCost)}</td>
                    <td className="px-2 py-2.5 text-right">
                      <button onClick={() => onOverride(it.componentId, it.id, { removed: true })} title="Remove" className="text-slate-300 hover:text-red-500">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Add-your-own items, after the calculation */}
      <div className="overflow-hidden rounded-xl border border-wf-line bg-white shadow-sm">
        <div className="bg-wf-blue px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">Added items</div>
        <div className="p-4">
          <ComponentEditor component={extras} onChange={onExtrasChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Items on list" value={takeoff.totals.itemCount} />
        <Stat label="Estimated material cost" value={money(takeoff.totals.materialCost)} />
        <Stat label="Estimated leftover value" value={money(takeoff.totals.leftoverValue)} amber />
      </div>
    </div>
  )
}

function Stat({ label, value, amber }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${amber ? 'border-amber-200 bg-amber-50' : 'border-wf-line bg-white'}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${amber ? 'text-amber-700' : 'text-wf-navy'}`}>{value}</div>
    </div>
  )
}
