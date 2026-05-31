import { computeJob } from '../materialRules.js'
import { money, jobNoLabel } from '../format.js'

// List of saved jobs from localStorage. Reopen, duplicate, or delete.
export default function SavedJobs({ jobs, config, onOpen, onDuplicate, onDelete, onNew }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wf-line bg-white p-10 text-center shadow-sm">
        <p className="text-slate-500">No saved jobs yet.</p>
        <button onClick={onNew} className="mt-4 rounded-lg bg-wf-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-wf-navy">
          + New job
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const t = computeJob(job, config)
        const parts = (job.components || []).map((c) => c.label).join(' · ') || 'No components'
        return (
          <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wf-line bg-white p-4 shadow-sm">
            <button onClick={() => onOpen(job.id)} className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="rounded bg-wf-pale px-1.5 py-0.5 text-[11px] font-bold text-wf-blue">{jobNoLabel(job.jobNumber)}</span>
                <span className="truncate font-semibold text-wf-navy">{job.name || 'Untitled job'}</span>
                <span className="text-[11px] text-slate-400">Rev {job.version || 1}</span>
                {job.quote?.enabled && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">Quoted</span>}
              </div>
              <div className="truncate text-sm text-slate-500">
                {job.customer || '—'} · {job.date} · {parts}
              </div>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-400">Material</div>
                <div className="font-bold tabular-nums text-wf-navy">{money(t.totals.materialCost)}</div>
              </div>
              <button onClick={() => onDuplicate(job.id)} className="text-sm font-medium text-wf-blue hover:underline">
                Duplicate
              </button>
              <button onClick={() => onDelete(job.id)} className="text-sm font-medium text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
