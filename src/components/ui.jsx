// Shared form primitives so every component editor looks the same.
export const inputCls =
  'w-full rounded-lg border border-wf-line bg-white px-3 py-2 text-wf-navy shadow-sm outline-none focus:border-wf-blue focus:ring-2 focus:ring-wf-sky/40'

export function Grid({ children }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-wf-navy">{label}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  )
}

export function NumField({ label, hint, value, onChange, min = '0', step = '0.5' }) {
  return (
    <Field label={label} hint={hint}>
      <input type="number" min={min} step={step} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}
