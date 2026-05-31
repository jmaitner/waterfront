import { SETTINGS_SCHEMA, DEFAULT_CONFIG } from '../materialRules.js'

// Materials & Pricing panel. Every constant from materialRules.js is editable
// here, persists to localStorage, and immediately recomputes every open job.
// THE demo moment: Will types in his real TimberTech/Westbury prices and watches
// the order sheet totals update live.
export default function SettingsPanel({ config, onChange, onReset }) {
  const setField = (key, raw, type) => {
    let val
    if (type === 'lengths') {
      val = raw
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
      if (val.length === 0) val = DEFAULT_CONFIG[key]
    } else {
      val = raw === '' ? 0 : parseFloat(raw)
      if (!Number.isFinite(val)) val = 0
    }
    onChange({ ...config, [key]: val })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wf-line bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Edit any price or assumption. Changes save automatically and update every job's quantities
          and dollar totals instantly.
        </p>
        <button onClick={onReset} className="rounded-lg border border-wf-line px-4 py-2 text-sm font-medium text-wf-navy hover:bg-wf-pale">
          Reset to defaults
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {SETTINGS_SCHEMA.map((group) => (
          <div key={group.group} className="rounded-xl border border-wf-line bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-wf-blue">{group.group}</h3>
            <div className="space-y-3">
              {group.fields.map((f) => {
                const isLengths = f.type === 'lengths'
                const isMoney = f.type === 'money'
                const value = isLengths
                  ? (config[f.key] || []).join(', ')
                  : config[f.key]
                return (
                  <label key={f.key} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-wf-navy">
                      {f.label}
                      {f.unit && <span className="ml-1 text-xs text-slate-400">{f.unit}</span>}
                    </span>
                    <div className="relative">
                      {isMoney && (
                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                      )}
                      <input
                        type={isLengths ? 'text' : 'number'}
                        step={isMoney ? '0.01' : 'any'}
                        value={value}
                        onChange={(e) => setField(f.key, e.target.value, f.type)}
                        className={`w-28 rounded-lg border border-wf-line py-1.5 text-right tabular-nums outline-none focus:border-wf-blue focus:ring-2 focus:ring-wf-sky/40 ${
                          isMoney ? 'pl-5 pr-2' : 'px-2'
                        }`}
                      />
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
