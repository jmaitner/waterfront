import { MATERIAL_LABELS } from '../materialRules.js'

// New-job / edit-job form. Edits flow straight up to App via onChange so the
// parts list recomputes instantly as you type.
export default function JobForm({ job, onChange }) {
  const inp = job.inputs

  const setMeta = (patch) => onChange({ ...job, ...patch })
  const setInput = (patch) => onChange({ ...job, inputs: { ...inp, ...patch } })
  const setRail = (side, val) => setInput({ railing: { ...inp.railing, [side]: val } })
  const setStairs = (patch) => setInput({ stairs: { ...inp.stairs, ...patch } })

  return (
    <div className="space-y-6">
      {/* Job identity */}
      <Section title="Job">
        <Grid>
          <Field label="Job name">
            <input className={inputCls} value={job.name} onChange={(e) => setMeta({ name: e.target.value })} placeholder="Smith back deck" />
          </Field>
          <Field label="Customer">
            <input className={inputCls} value={job.customer} onChange={(e) => setMeta({ customer: e.target.value })} placeholder="John Smith" />
          </Field>
          <Field label="Date">
            <input type="date" className={inputCls} value={job.date} onChange={(e) => setMeta({ date: e.target.value })} />
          </Field>
        </Grid>
      </Section>

      {/* Dimensions */}
      <Section title="Deck dimensions" hint="Rectangular deck only in this version.">
        <Grid>
          <Field label="Length (ft)" hint="along the house">
            <input type="number" min="0" step="0.5" className={inputCls} value={inp.lengthFt} onChange={(e) => setInput({ lengthFt: e.target.value })} />
          </Field>
          <Field label="Projection / width (ft)" hint="out from the house">
            <input type="number" min="0" step="0.5" className={inputCls} value={inp.depthFt} onChange={(e) => setInput({ depthFt: e.target.value })} />
          </Field>
          <Field label="Height (ft)" hint="drives post + footing count">
            <input type="number" min="0" step="0.5" className={inputCls} value={inp.heightFt} onChange={(e) => setInput({ heightFt: e.target.value })} />
          </Field>
        </Grid>
      </Section>

      {/* Materials */}
      <Section title="Materials">
        <Grid>
          <Field label="Decking material">
            <select className={inputCls} value={inp.material} onChange={(e) => setInput({ material: e.target.value })}>
              {Object.entries(MATERIAL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Board run direction">
            <select className={inputCls} value={inp.boardDirection} onChange={(e) => setInput({ boardDirection: e.target.value })}>
              <option value="parallel">Parallel to house</option>
              <option value="perpendicular">Perpendicular to house</option>
            </select>
          </Field>
          <Field label="Joist spacing (in O.C.)" hint="blank = material default">
            <input type="number" min="0" step="1" className={inputCls} placeholder={inp.material === 'pt' ? '16' : '12'} value={inp.joistSpacingIn ?? ''} onChange={(e) => setInput({ joistSpacingIn: e.target.value === '' ? null : e.target.value })} />
          </Field>
        </Grid>
      </Section>

      {/* Railing */}
      <Section title="Railing" hint="Westbury aluminum. Default = perimeter minus the house side.">
        <div className="flex flex-wrap gap-2">
          {[
            ['far', 'Far side'],
            ['left', 'Left side'],
            ['right', 'Right side'],
            ['house', 'House side'],
          ].map(([side, label]) => (
            <button
              key={side}
              type="button"
              onClick={() => setRail(side, !inp.railing[side])}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                inp.railing[side]
                  ? 'border-wf-blue bg-wf-blue text-white'
                  : 'border-wf-line bg-white text-wf-navy hover:border-wf-sky'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Stairs */}
      <Section title="Stairs" hint="Optional. Approximated in this version.">
        <label className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="h-4 w-4 accent-wf-blue" checked={inp.stairs.enabled} onChange={(e) => setStairs({ enabled: e.target.checked })} />
          Include stairs
        </label>
        {inp.stairs.enabled && (
          <Grid>
            <Field label="Number of steps">
              <input type="number" min="1" step="1" className={inputCls} value={inp.stairs.steps} onChange={(e) => setStairs({ steps: e.target.value })} />
            </Field>
            <Field label="Stair width (ft)">
              <input type="number" min="1" step="0.5" className={inputCls} value={inp.stairs.widthFt} onChange={(e) => setStairs({ widthFt: e.target.value })} />
            </Field>
          </Grid>
        )}
      </Section>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-wf-line bg-white px-3 py-2 text-wf-navy shadow-sm outline-none focus:border-wf-blue focus:ring-2 focus:ring-wf-sky/40'

function Section({ title, hint, children }) {
  return (
    <div className="rounded-xl border border-wf-line bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-wf-blue">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-wf-navy">{label}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  )
}
