import { MATERIAL_LABELS } from '../materialRules.js'
import { inputCls, Grid, Field, NumField } from './ui.jsx'
import { money } from '../format.js'

// One editor per component type. Each takes the component and an onChange that
// receives the updated component; edits flow straight up so the parts list
// recomputes live.

export function ComponentEditor({ component, onChange }) {
  const setInputs = (patch) => onChange({ ...component, inputs: { ...component.inputs, ...patch } })
  switch (component.type) {
    case 'deck':
      return <DeckEditor inp={component.inputs} set={setInputs} />
    case 'stairs':
      return <StairsEditor inp={component.inputs} set={setInputs} />
    case 'railing':
      return <RailingEditor inp={component.inputs} set={setInputs} />
    case 'wall':
      return <WallEditor inp={component.inputs} set={setInputs} />
    case 'custom':
      return <CustomEditor component={component} onChange={onChange} />
    default:
      return null
  }
}

function DeckEditor({ inp, set }) {
  const setRail = (side, val) => set({ railing: { ...inp.railing, [side]: val } })
  return (
    <div className="space-y-4">
      <Grid>
        <NumField label="Length (ft)" hint="along the house" value={inp.lengthFt} onChange={(v) => set({ lengthFt: v })} />
        <NumField label="Projection (ft)" hint="out from the house" value={inp.depthFt} onChange={(v) => set({ depthFt: v })} />
        <NumField label="Height (ft)" hint="posts + footings" value={inp.heightFt} onChange={(v) => set({ heightFt: v })} />
      </Grid>
      <Grid>
        <Field label="Decking material">
          <select className={inputCls} value={inp.material} onChange={(e) => set({ material: e.target.value })}>
            {Object.entries(MATERIAL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Board run direction">
          <select className={inputCls} value={inp.boardDirection} onChange={(e) => set({ boardDirection: e.target.value })}>
            <option value="parallel">Parallel to house</option>
            <option value="perpendicular">Perpendicular to house</option>
          </select>
        </Field>
        <Field label="Joist spacing (in O.C.)" hint="blank = material default">
          <input type="number" min="0" step="1" className={inputCls} placeholder={inp.material === 'pt' ? '16' : '12'} value={inp.joistSpacingIn ?? ''} onChange={(e) => set({ joistSpacingIn: e.target.value === '' ? null : e.target.value })} />
        </Field>
      </Grid>
      <div>
        <div className="mb-1.5 text-sm font-medium text-wf-navy">Railing sides <span className="text-xs font-normal text-slate-400">default = perimeter minus the house side</span></div>
        <div className="flex flex-wrap gap-2">
          {[['far', 'Far side'], ['left', 'Left side'], ['right', 'Right side'], ['house', 'House side']].map(([side, label]) => (
            <button key={side} type="button" onClick={() => setRail(side, !inp.railing[side])}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                inp.railing[side] ? 'border-wf-blue bg-wf-blue text-white' : 'border-wf-line bg-white text-wf-navy hover:border-wf-sky'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StairsEditor({ inp, set }) {
  return (
    <div className="space-y-4">
      <Grid>
        <NumField label="Total rise (ft)" hint="vertical drop — bluff runs are big" value={inp.riseFt} onChange={(v) => set({ riseFt: v })} />
        <NumField label="Width (ft)" value={inp.widthFt} onChange={(v) => set({ widthFt: v })} />
        <NumField label="Intermediate landings" hint="0 for a straight run" min="0" step="1" value={inp.landings} onChange={(v) => set({ landings: v })} />
      </Grid>
      <Grid>
        <NumField label="Landing size (ft)" hint="depth of each landing" value={inp.landingSizeFt} onChange={(v) => set({ landingSizeFt: v })} />
        <Field label="Tread material">
          <select className={inputCls} value={inp.material} onChange={(e) => set({ material: e.target.value })}>
            {Object.entries(MATERIAL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Railing">
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-wf-blue" checked={inp.railedBothSides} onChange={(e) => set({ railedBothSides: e.target.checked })} />
            Railing on both sides
          </label>
        </Field>
      </Grid>
    </div>
  )
}

function RailingEditor({ inp, set }) {
  return (
    <Grid>
      <NumField label="Lineal feet" hint="total run of railing" value={inp.linealFt} onChange={(v) => set({ linealFt: v })} />
      <Field label="Sides">
        <select className={inputCls} value={inp.sides} onChange={(e) => set({ sides: parseInt(e.target.value, 10) })}>
          <option value={1}>Single run</option>
          <option value={2}>Both sides (×2)</option>
        </select>
      </Field>
    </Grid>
  )
}

function WallEditor({ inp, set }) {
  return (
    <Grid>
      <Field label="Wall type">
        <select className={inputCls} value={inp.type} onChange={(e) => set({ type: e.target.value })}>
          <option value="block">Segmental block</option>
          <option value="timber">6x6 timber</option>
        </select>
      </Field>
      <NumField label="Length (ft)" value={inp.lengthFt} onChange={(v) => set({ lengthFt: v })} />
      <NumField label="Exposed height (ft)" value={inp.heightFt} onChange={(v) => set({ heightFt: v })} />
    </Grid>
  )
}

const CATEGORY_OPTIONS = ['Custom', 'Framing', 'Decking', 'Fasteners', 'Railing', 'Trim & Fascia', 'Posts & Footings', 'Retaining Wall']

function CustomEditor({ component, onChange }) {
  const items = component.items || []
  const setItems = (next) => onChange({ ...component, items: next })
  const update = (i, patch) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i))
  const addRow = () => setItems([...items, { name: '', category: 'Custom', qty: 1, unit: 'each', unitPrice: 0 }])

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        For one-offs the formulas don't cover — a kayak ramp, a custom gate, special hardware. Add any
        item by hand; it flows into the order sheet and totals like everything else.
      </p>
      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-1 font-semibold">Item</th>
                <th className="px-2 py-1 font-semibold">Category</th>
                <th className="px-2 py-1 text-right font-semibold">Qty</th>
                <th className="px-2 py-1 font-semibold">Unit</th>
                <th className="px-2 py-1 text-right font-semibold">Unit $</th>
                <th className="px-2 py-1 text-right font-semibold">Line</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="px-2 py-1"><input className={inputCls} value={it.name} placeholder="Kayak ramp hardware" onChange={(e) => update(i, { name: e.target.value })} /></td>
                  <td className="px-2 py-1">
                    <select className={inputCls} value={it.category} onChange={(e) => update(i, { category: e.target.value })}>
                      {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1"><input type="number" min="0" className={`${inputCls} w-20 text-right`} value={it.qty} onChange={(e) => update(i, { qty: e.target.value })} /></td>
                  <td className="px-2 py-1"><input className={`${inputCls} w-24`} value={it.unit} placeholder="each" onChange={(e) => update(i, { unit: e.target.value })} /></td>
                  <td className="px-2 py-1"><input type="number" min="0" step="0.01" className={`${inputCls} w-24 text-right`} value={it.unitPrice} onChange={(e) => update(i, { unitPrice: e.target.value })} /></td>
                  <td className="px-2 py-1 text-right tabular-nums text-wf-navy">{money(num(it.qty) * num(it.unitPrice))}</td>
                  <td className="px-2 py-1 text-right"><button onClick={() => remove(i)} className="text-red-500 hover:underline">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={addRow} className="rounded-lg border border-wf-blue px-4 py-2 text-sm font-semibold text-wf-blue hover:bg-wf-pale">
        + Add custom item
      </button>
    </div>
  )
}

function num(v) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
