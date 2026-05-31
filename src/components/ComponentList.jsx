import { useState } from 'react'
import { COMPONENT_TYPES, newComponent, computeComponent } from '../materialRules.js'
import { ComponentEditor } from './ComponentEditors.jsx'
import { money } from '../format.js'

// The job builder: job is a list of components. Add deck / stairs / railing /
// wall / custom cards; each shows a live summary + material subtotal.
export default function ComponentList({ components, config, onChange }) {
  const [adding, setAdding] = useState(false)

  const addType = (type) => {
    onChange([...components, newComponent(type)])
    setAdding(false)
  }
  const updateComp = (updated) => onChange(components.map((c) => (c.id === updated.id ? updated : c)))
  const removeComp = (id) => onChange(components.filter((c) => c.id !== id))

  return (
    <div className="space-y-4">
      {components.map((comp, i) => (
        <ComponentCard
          key={comp.id}
          comp={comp}
          config={config}
          index={i}
          onChange={updateComp}
          onRemove={() => removeComp(comp.id)}
        />
      ))}

      {components.length === 0 && (
        <div className="rounded-xl border border-dashed border-wf-line bg-white p-6 text-center text-sm text-slate-500">
          No components yet. Add a deck, stairs, railing, wall, or custom items below.
        </div>
      )}

      {/* Add component */}
      {adding ? (
        <div className="rounded-xl border border-wf-blue bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-wf-navy">Add a component</span>
            <button onClick={() => setAdding(false)} className="text-sm text-slate-400 hover:text-wf-navy">Cancel</button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {COMPONENT_TYPES.map((t) => (
              <button key={t.type} onClick={() => addType(t.type)}
                className="rounded-lg border border-wf-line p-3 text-left transition hover:border-wf-blue hover:bg-wf-pale">
                <div className="font-semibold text-wf-navy">{t.label}</div>
                <div className="text-xs text-slate-500">{t.blurb}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full rounded-xl border-2 border-dashed border-wf-line py-3 text-sm font-semibold text-wf-blue transition hover:border-wf-blue hover:bg-wf-pale">
          + Add component
        </button>
      )}
    </div>
  )
}

function ComponentCard({ comp, config, index, onChange, onRemove }) {
  const [open, setOpen] = useState(true)
  const computed = computeComponent(comp, config)
  const subtotal = computed.items.reduce((s, it) => s + it.lineCost, 0)
  const typeLabel = COMPONENT_TYPES.find((t) => t.type === comp.type)?.label || comp.type

  return (
    <div className="overflow-hidden rounded-xl border border-wf-line bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-wf-line bg-wf-pale/50 px-4 py-3">
        <span className="rounded-md bg-wf-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {typeLabel}
        </span>
        <input
          value={comp.label}
          onChange={(e) => onChange({ ...comp, label: e.target.value })}
          className="min-w-0 flex-1 bg-transparent font-semibold text-wf-navy outline-none focus:underline"
          aria-label="Component name"
        />
        <span className="hidden text-xs text-slate-500 sm:block">{computed.summary}</span>
        <span className="font-bold tabular-nums text-wf-navy">{money(subtotal)}</span>
        <button onClick={() => setOpen((v) => !v)} className="text-slate-400 hover:text-wf-navy" aria-label="Toggle">
          {open ? '▾' : '▸'}
        </button>
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500" aria-label="Remove">✕</button>
      </div>
      {open && (
        <div className="p-4">
          <ComponentEditor component={comp} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
