import { computeLabor, seedLaborLines, defaultLabor } from '../labor.js'
import { inputCls } from './ui.jsx'
import { money } from '../format.js'

// Step 4. Estimate labor as tasks × hours × rate. The total flows into the
// customer quote as a cost line (hit "Re-sync material costs" on the quote, or
// re-seed, to pull a changed number through).
export default function LaborStep({ job, takeoff, config, onChange }) {
  const labor = job.labor || defaultLabor()
  const computed = computeLabor(labor, config)

  const set = (patch) => onChange({ ...labor, ...patch })
  const update = (id, patch) => set({ lines: labor.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) })
  const remove = (id) => set({ lines: labor.lines.filter((l) => l.id !== id) })
  const addLine = () =>
    set({ lines: [...labor.lines, { id: `lb_custom_${labor.lines.length}_${Math.floor(Math.random() * 1e5)}`, task: '', hours: 0, rate: '' }] })
  const seed = () => set({ lines: seedLaborLines(takeoff, config.laborRatePerHr) })

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-wf-line bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-wf-blue">Labor estimate</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Default rate {money(config.laborRatePerHr)}/hr (edit in Materials &amp; Pricing). Override the rate on any
              line for a sub.
            </p>
          </div>
          <button onClick={seed} className="rounded-lg border border-wf-blue px-3 py-1.5 text-xs font-semibold text-wf-blue hover:bg-wf-pale">
            {labor.lines.length === 0 ? 'Estimate one line per component' : 'Re-seed from components'}
          </button>
        </div>

        {labor.lines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-wf-line p-6 text-center text-sm text-slate-500">
            No labor lines yet. Seed one per component above, or add lines by hand.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-wf-line text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2 font-semibold">Task</th>
                  <th className="px-2 py-2 text-right font-semibold">Hours</th>
                  <th className="px-2 py-2 text-right font-semibold">Rate $/hr</th>
                  <th className="px-2 py-2 text-right font-semibold">Cost</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {computed.lines.map((l) => (
                  <tr key={l.id} className="border-b border-wf-line/60">
                    <td className="px-2 py-1.5"><input value={l.task} placeholder="Task" onChange={(e) => update(l.id, { task: e.target.value })} className={inputCls} /></td>
                    <td className="px-2 py-1.5"><input type="number" min="0" step="0.5" value={labor.lines.find((x) => x.id === l.id).hours} onChange={(e) => update(l.id, { hours: e.target.value })} className={`${inputCls} w-24 text-right tabular-nums`} /></td>
                    <td className="px-2 py-1.5"><input type="number" min="0" step="1" value={labor.lines.find((x) => x.id === l.id).rate} placeholder={String(config.laborRatePerHr)} onChange={(e) => update(l.id, { rate: e.target.value })} className={`${inputCls} w-24 text-right tabular-nums`} /></td>
                    <td className="px-2 py-1.5 text-right tabular-nums font-medium text-wf-navy">{money(l.cost)}</td>
                    <td className="px-2 py-1.5 text-right"><button onClick={() => remove(l.id)} className="text-slate-400 hover:text-red-500">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={addLine} className="mt-3 rounded-lg border border-wf-blue px-4 py-2 text-sm font-semibold text-wf-blue hover:bg-wf-pale">
          + Add labor line
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <Stat label="Total labor hours" value={computed.totalHours} />
        <Stat label="Estimated labor cost" value={money(computed.total)} accent />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${accent ? 'border-wf-line bg-wf-pale' : 'border-wf-line bg-white'}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-wf-navy">{value}</div>
    </div>
  )
}
