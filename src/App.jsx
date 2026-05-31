import { useEffect, useMemo, useRef, useState } from 'react'
import Brand from './components/Brand.jsx'
import ComponentList from './components/ComponentList.jsx'
import ReviewTable from './components/ReviewTable.jsx'
import OrderSheet from './components/OrderSheet.jsx'
import QuoteBuilder from './components/QuoteBuilder.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import SavedJobs from './components/SavedJobs.jsx'
import { inputCls, Field, Grid } from './components/ui.jsx'
import { computeJob, DEFAULT_CONFIG, newJobComponents } from './materialRules.js'
import { defaultQuote } from './quote.js'
import { loadConfig, saveConfig, loadJobs, saveJobs, newId, nextJobNumber } from './storage.js'
import { todayISO, nowISO, jobNoLabel } from './format.js'

// Single-page app. View is driven by local state; everything persists to
// localStorage so the foreman can close the tab and come back to saved jobs.
const STEPS = [
  { id: 'job', label: '1 · Build job' },
  { id: 'review', label: '2 · Review parts' },
  { id: 'order', label: '3 · Order sheet' },
  { id: 'quote', label: '4 · Customer quote' },
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
    quote: defaultQuote(),
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
  function setComponents(components) {
    if (!current) return
    updateJob({ ...current, components })
  }
  function setQuote(quote) {
    if (!current) return
    updateJob({ ...current, quote })
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
  function setOverride(componentId, itemId, value) {
    if (!current) return
    const components = current.components.map((c) =>
      c.id === componentId ? { ...c, overrides: { ...(c.overrides || {}), [itemId]: value } } : c,
    )
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
            <div className="no-print mb-3 flex items-center gap-2 text-sm">
              <span className="rounded-md bg-wf-navy px-2 py-0.5 font-bold text-white">{jobNoLabel(current.jobNumber)}</span>
              <span className="rounded-md border border-wf-line bg-white px-2 py-0.5 font-medium text-wf-navy">Rev {current.version}</span>
              <span className="text-slate-400">updated {(current.updatedAt || '').slice(0, 10)}</span>
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

                <div className="no-print flex justify-end">
                  <button onClick={() => setStep('review')} className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy">
                    Review parts list →
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && takeoff && (
              <div>
                <ReviewTable takeoff={takeoff} onOverride={setOverride} onResetAll={resetOverrides} hasOverrides={hasOverrides} showSource={showSource} />
                <div className="no-print mt-6 flex justify-between">
                  <button onClick={() => setStep('job')} className="rounded-lg border border-wf-line px-5 py-2.5 font-semibold text-wf-navy hover:bg-white">
                    ← Edit job
                  </button>
                  <button onClick={() => setStep('order')} className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy">
                    Build order sheet →
                  </button>
                </div>
              </div>
            )}

            {step === 'order' && takeoff && <OrderSheet job={current} takeoff={takeoff} showSource={showSource} />}

            {step === 'quote' && takeoff && <QuoteBuilder job={current} takeoff={takeoff} onChange={setQuote} />}
          </div>
        )}
      </main>
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
