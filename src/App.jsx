import { useEffect, useMemo, useRef, useState } from 'react'
import Brand from './components/Brand.jsx'
import ComponentList from './components/ComponentList.jsx'
import ReviewTable from './components/ReviewTable.jsx'
import OrderSheet from './components/OrderSheet.jsx'
import LaborStep from './components/LaborStep.jsx'
import QuoteBuilder from './components/QuoteBuilder.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import SavedJobs from './components/SavedJobs.jsx'
import { inputCls, Field, Grid } from './components/ui.jsx'
import { computeJob, DEFAULT_CONFIG, newJobComponents, newComponent } from './materialRules.js'
import { defaultQuote } from './quote.js'
import { defaultLabor } from './labor.js'
import { loadConfig, saveConfig, loadJobs, saveJobs, newId, nextJobNumber } from './storage.js'
import { todayISO, nowISO, jobNoLabel } from './format.js'

// Single-page app. View is driven by local state; everything persists to
// localStorage so the foreman can close the tab and come back to saved jobs.
const STEPS = [
  { id: 'job', label: '1 · Build job' },
  { id: 'review', label: '2 · Review parts' },
  { id: 'order', label: '3 · Order sheet' },
  { id: 'labor', label: '4 · Labor' },
  { id: 'quote', label: '5 · Customer quote' },
]

function blankJob() {
  return {
    id: newId(),
    jobNumber: nextJobNumber(),
    version: 1,
    name: '',
    customer: '',
    date: todayISO(),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    components: newJobComponents(),
    labor: defaultLabor(),
    quote: defaultQuote(),
    revisions: [],
  }
}

export default function App() {
  const [config, setConfig] = useState(loadConfig)
  const [jobs, setJobs] = useState(loadJobs)
  const [view, setView] = useState('jobs') // 'jobs' | 'editor' | 'settings'
  const [step, setStep] = useState('job')
  const [currentId, setCurrentId] = useState(null)

  useEffect(() => saveConfig(config), [config])
  useEffect(() => saveJobs(jobs), [jobs])

  const current = jobs.find((j) => j.id === currentId) || null
  const takeoff = useMemo(() => (current ? computeJob(current, config) : null), [current, config])
  const showSource = (current?.components?.length || 0) > 1

  // Tracks the open editing session so the job version bumps ONCE per session
  // (open a saved job, edit it -> v2; reopen, edit -> v3) instead of per keystroke.
  const openSession = useRef({ id: null, counted: false })

  // ---- job actions ----
  function startNewJob() {
    const job = blankJob()
    openSession.current = { id: job.id, counted: true } // building v1 — don't bump
    setJobs((js) => [job, ...js])
    setCurrentId(job.id)
    setStep('job')
    setView('editor')
  }
  function openJob(id) {
    openSession.current = { id, counted: false } // first edit this session -> new revision
    setCurrentId(id)
    setStep('job')
    setView('editor')
  }
  function updateJob(updated) {
    const s = openSession.current
    let next = { ...updated, updatedAt: nowISO() }
    if (s.id === updated.id && !s.counted) {
      next = { ...next, version: (updated.version || 1) + 1 }
      s.counted = true
    }
    setJobs((js) => js.map((j) => (j.id === next.id ? next : j)))
  }
  // Save without bumping the revision (used for publish/restore, which manage
  // versions themselves).
  function updateJobRaw(updated) {
    setJobs((js) => js.map((j) => (j.id === updated.id ? { ...updated, updatedAt: nowISO() } : j)))
  }
  function setComponents(components) {
    if (!current) return
    updateJob({ ...current, components })
  }
  function setQuote(quote) {
    if (!current) return
    updateJob({ ...current, quote })
  }
  function setLabor(labor) {
    if (!current) return
    updateJob({ ...current, labor })
  }

  // Custom items added on the Review step live in a dedicated "Added items"
  // component (created on first use).
  const extras = current?.components.find((c) => c.reviewExtras) || { ...newComponent('custom'), reviewExtras: true, label: 'Added items' }
  function setExtras(updated) {
    if (!current) return
    const exists = current.components.some((c) => c.id === updated.id)
    const components = exists
      ? current.components.map((c) => (c.id === updated.id ? updated : c))
      : [...current.components, updated]
    updateJob({ ...current, components })
  }

  // ---- publish a snapshot + restore a previous revision ----
  function publishJob() {
    if (!current) return
    const snapshot = {
      id: `rev_${current.version}_${Math.floor(Math.random() * 1e6).toString(36)}`,
      version: current.version,
      publishedAt: nowISO(),
      data: structuredClone({
        name: current.name, customer: current.customer, date: current.date,
        components: current.components, labor: current.labor, quote: current.quote,
      }),
    }
    updateJobRaw({ ...current, revisions: [snapshot, ...(current.revisions || [])], publishedVersion: current.version })
  }
  function restoreRevision(revId) {
    if (!current) return
    const rev = (current.revisions || []).find((r) => r.id === revId)
    if (!rev) return
    if (!window.confirm(`Restore the published Rev ${rev.version}? Your current working changes will be replaced.`)) return
    const restored = { ...current, ...structuredClone(rev.data), version: (current.version || 1) + 1 }
    openSession.current = { id: current.id, counted: true } // restore already counts as the bump
    updateJobRaw(restored)
  }
  function duplicateJob(id) {
    const src = jobs.find((j) => j.id === id)
    if (!src) return
    const copy = {
      ...structuredClone(src),
      id: newId(),
      jobNumber: nextJobNumber(),
      version: 1,
      name: `${src.name || 'Job'} (copy)`,
      date: todayISO(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    setJobs((js) => [copy, ...js])
  }
  function deleteJob(id) {
    setJobs((js) => js.filter((j) => j.id !== id))
    if (currentId === id) {
      setCurrentId(null)
      setView('jobs')
    }
  }

  // ---- override actions (per component) ----
  // patch is a partial { qtyToOrder?, unitPrice?, qtyNeeded?, removed? } merged
  // onto any existing override for that item.
  function setOverride(componentId, itemId, patch) {
    if (!current) return
    const components = current.components.map((c) => {
      if (c.id !== componentId) return c
      const ovs = { ...(c.overrides || {}) }
      const prev = ovs[itemId]
      const prevObj = typeof prev === 'object' && prev !== null ? prev : prev != null && prev !== '' ? { qtyToOrder: prev } : {}
      ovs[itemId] = { ...prevObj, ...patch }
      return { ...c, overrides: ovs }
    })
    updateJob({ ...current, components })
  }
  function resetOverrides() {
    if (!current) return
    const components = current.components.map((c) => ({ ...c, overrides: {} }))
    updateJob({ ...current, components })
  }
  const hasOverrides =
    current && current.components.some((c) => Object.keys(c.overrides || {}).length > 0)

  return (
    <div className="min-h-full">
      <header className="no-print sticky top-0 z-10 border-b border-wf-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button onClick={() => setView('jobs')} className="flex items-center">
            <Brand compact />
          </button>
          <nav className="flex items-center gap-1 text-sm">
            <NavBtn active={view === 'jobs'} onClick={() => setView('jobs')}>Saved jobs</NavBtn>
            <NavBtn active={view === 'settings'} onClick={() => setView('settings')}>Materials &amp; Pricing</NavBtn>
            <button onClick={startNewJob} className="ml-2 rounded-lg bg-wf-blue px-4 py-2 font-semibold text-white hover:bg-wf-navy">
              + New job
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view === 'jobs' && (
          <Page title="Saved jobs" subtitle="Reopen a past job or start a new takeoff.">
            <SavedJobs jobs={jobs} config={config} onOpen={openJob} onDuplicate={duplicateJob} onDelete={deleteJob} onNew={startNewJob} />
          </Page>
        )}

        {view === 'settings' && (
          <Page title="Materials & Pricing" subtitle="Seeded with industry placeholders — replace with real supplier numbers.">
            <SettingsPanel config={config} onChange={setConfig} onReset={() => setConfig({ ...DEFAULT_CONFIG })} />
          </Page>
        )}

        {view === 'editor' && current && (
          <div>
            <div className="no-print mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-md bg-wf-navy px-2 py-0.5 font-bold text-white">{jobNoLabel(current.jobNumber)}</span>
              <span className="rounded-md border border-wf-line bg-white px-2 py-0.5 font-medium text-wf-navy">Rev {current.version}</span>
              {current.publishedVersion === current.version && (
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Published</span>
              )}
              <span className="text-slate-400">updated {(current.updatedAt || '').slice(0, 10)}</span>

              <div className="ml-auto flex items-center gap-2">
                {(current.revisions || []).length > 0 && (
                  <select
                    value=""
                    onChange={(e) => e.target.value && restoreRevision(e.target.value)}
                    className="rounded-lg border border-wf-line bg-white px-2 py-1.5 text-xs font-medium text-wf-navy outline-none"
                  >
                    <option value="">Revisions ({current.revisions.length}) ▾</option>
                    {current.revisions.map((r) => (
                      <option key={r.id} value={r.id}>
                        Rev {r.version} · {(r.publishedAt || '').slice(0, 10)}
                      </option>
                    ))}
                  </select>
                )}
                <button onClick={publishJob} className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                  Publish Rev {current.version}
                </button>
                <button onClick={() => setView('jobs')} className="rounded-lg border border-wf-line bg-white px-3 py-1.5 text-xs font-semibold text-wf-navy hover:bg-wf-pale">
                  Save &amp; exit
                </button>
              </div>
            </div>
            <div className="no-print mb-5 flex flex-wrap gap-2">
              {STEPS.map((s) => (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    step === s.id ? 'bg-wf-navy text-white' : 'border border-wf-line bg-white text-wf-navy hover:border-wf-sky'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>

            {step === 'job' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-wf-line bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-wf-blue">Job</h3>
                  <Grid>
                    <Field label="Job name">
                      <input className={inputCls} value={current.name} onChange={(e) => updateJob({ ...current, name: e.target.value })} placeholder="Anderson lakeside deck" />
                    </Field>
                    <Field label="Customer">
                      <input className={inputCls} value={current.customer} onChange={(e) => updateJob({ ...current, customer: e.target.value })} placeholder="John Anderson" />
                    </Field>
                    <Field label="Date">
                      <input type="date" className={inputCls} value={current.date} onChange={(e) => updateJob({ ...current, date: e.target.value })} />
                    </Field>
                  </Grid>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-wf-blue">Components</h3>
                  <ComponentList components={current.components} config={config} onChange={setComponents} />
                </div>

                <StepNav onNext={() => setStep('review')} nextLabel="Review parts list" />
              </div>
            )}

            {step === 'review' && takeoff && (
              <div>
                <ReviewTable takeoff={takeoff} onOverride={setOverride} onResetAll={resetOverrides} hasOverrides={hasOverrides} showSource={showSource} extras={extras} onExtrasChange={setExtras} />
                <StepNav onBack={() => setStep('job')} backLabel="Edit job" onNext={() => setStep('order')} nextLabel="Order sheet" />
              </div>
            )}

            {step === 'order' && takeoff && (
              <div>
                <OrderSheet job={current} takeoff={takeoff} showSource={showSource} />
                <StepNav onBack={() => setStep('review')} backLabel="Review parts" onNext={() => setStep('labor')} nextLabel="Labor" />
              </div>
            )}

            {step === 'labor' && takeoff && (
              <div>
                <LaborStep job={current} takeoff={takeoff} config={config} onChange={setLabor} />
                <StepNav onBack={() => setStep('order')} backLabel="Order sheet" onNext={() => setStep('quote')} nextLabel="Customer quote" />
              </div>
            )}

            {step === 'quote' && takeoff && <QuoteBuilder job={current} takeoff={takeoff} config={config} onChange={setQuote} />}
          </div>
        )}
      </main>
    </div>
  )
}

function StepNav({ onBack, backLabel, onNext, nextLabel }) {
  return (
    <div className="no-print mt-6 flex justify-between">
      {onBack ? (
        <button onClick={onBack} className="rounded-lg border border-wf-line px-5 py-2.5 font-semibold text-wf-navy hover:bg-white">
          ← {backLabel}
        </button>
      ) : (
        <span />
      )}
      {onNext && (
        <button onClick={onNext} className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy">
          {nextLabel} →
        </button>
      )}
    </div>
  )
}

function NavBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-2 font-medium transition ${active ? 'bg-wf-pale text-wf-navy' : 'text-slate-500 hover:text-wf-navy'}`}>
      {children}
    </button>
  )
}

function Page({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-wf-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
