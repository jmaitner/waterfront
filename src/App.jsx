import { useEffect, useMemo, useState } from 'react'
import Brand from './components/Brand.jsx'
import JobForm from './components/JobForm.jsx'
import ReviewTable from './components/ReviewTable.jsx'
import OrderSheet from './components/OrderSheet.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import SavedJobs from './components/SavedJobs.jsx'
import { computeTakeoff, DEFAULT_JOB_INPUTS, DEFAULT_CONFIG } from './materialRules.js'
import { loadConfig, saveConfig, loadJobs, saveJobs, newId } from './storage.js'
import { todayISO } from './format.js'

// Single-page app. View is driven by local state; everything persists to
// localStorage so the foreman can close the tab and come back to saved jobs.
const STEPS = [
  { id: 'job', label: '1 · Job & dimensions' },
  { id: 'review', label: '2 · Review parts' },
  { id: 'order', label: '3 · Order sheet' },
]

function blankJob() {
  return {
    id: newId(),
    name: '',
    customer: '',
    date: todayISO(),
    inputs: structuredClone(DEFAULT_JOB_INPUTS),
    overrides: {},
  }
}

export default function App() {
  const [config, setConfig] = useState(loadConfig)
  const [jobs, setJobs] = useState(loadJobs)
  const [view, setView] = useState('jobs') // 'jobs' | 'editor' | 'settings'
  const [step, setStep] = useState('job') // within editor
  const [currentId, setCurrentId] = useState(null)

  // Persist on change.
  useEffect(() => saveConfig(config), [config])
  useEffect(() => saveJobs(jobs), [jobs])

  const current = jobs.find((j) => j.id === currentId) || null

  // Recompute live whenever the job inputs/overrides or config change.
  const takeoff = useMemo(
    () => (current ? computeTakeoff(current, config) : null),
    [current, config],
  )

  // ---- job actions ----
  function startNewJob() {
    const job = blankJob()
    setJobs((js) => [job, ...js])
    setCurrentId(job.id)
    setStep('job')
    setView('editor')
  }
  function openJob(id) {
    setCurrentId(id)
    setStep('job')
    setView('editor')
  }
  function updateJob(updated) {
    setJobs((js) => js.map((j) => (j.id === updated.id ? updated : j)))
  }
  function duplicateJob(id) {
    const src = jobs.find((j) => j.id === id)
    if (!src) return
    const copy = { ...structuredClone(src), id: newId(), name: `${src.name || 'Job'} (copy)`, date: todayISO() }
    setJobs((js) => [copy, ...js])
  }
  function deleteJob(id) {
    setJobs((js) => js.filter((j) => j.id !== id))
    if (currentId === id) {
      setCurrentId(null)
      setView('jobs')
    }
  }

  // ---- override actions ----
  function setOverride(itemId, value) {
    if (!current) return
    updateJob({ ...current, overrides: { ...current.overrides, [itemId]: value } })
  }
  function resetOverrides() {
    if (!current) return
    updateJob({ ...current, overrides: {} })
  }
  const hasOverrides = current && Object.keys(current.overrides || {}).length > 0

  return (
    <div className="min-h-full">
      {/* Header */}
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
            <SavedJobs
              jobs={jobs}
              config={config}
              onOpen={openJob}
              onDuplicate={duplicateJob}
              onDelete={deleteJob}
              onNew={startNewJob}
            />
          </Page>
        )}

        {view === 'settings' && (
          <Page title="Materials & Pricing" subtitle="Seeded with industry placeholders — replace with real supplier numbers.">
            <SettingsPanel
              config={config}
              onChange={setConfig}
              onReset={() => setConfig({ ...DEFAULT_CONFIG })}
            />
          </Page>
        )}

        {view === 'editor' && current && (
          <div>
            {/* Step tabs */}
            <div className="no-print mb-5 flex flex-wrap gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    step === s.id ? 'bg-wf-navy text-white' : 'bg-white text-wf-navy border border-wf-line hover:border-wf-sky'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {step === 'job' && (
              <div>
                <JobForm job={current} onChange={updateJob} />
                <div className="no-print mt-6 flex justify-end">
                  <button onClick={() => setStep('review')} className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy">
                    Review parts list →
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && takeoff && (
              <div>
                <ReviewTable
                  takeoff={takeoff}
                  onOverride={setOverride}
                  onResetAll={resetOverrides}
                  hasOverrides={hasOverrides}
                />
                <div className="no-print mt-6 flex justify-between">
                  <button onClick={() => setStep('job')} className="rounded-lg border border-wf-line px-5 py-2.5 font-semibold text-wf-navy hover:bg-white">
                    ← Edit dimensions
                  </button>
                  <button onClick={() => setStep('order')} className="rounded-lg bg-wf-blue px-6 py-2.5 font-semibold text-white hover:bg-wf-navy">
                    Build order sheet →
                  </button>
                </div>
              </div>
            )}

            {step === 'order' && takeoff && <OrderSheet job={current} takeoff={takeoff} />}
          </div>
        )}
      </main>
    </div>
  )
}

function NavBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 font-medium transition ${
        active ? 'bg-wf-pale text-wf-navy' : 'text-slate-500 hover:text-wf-navy'
      }`}
    >
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
