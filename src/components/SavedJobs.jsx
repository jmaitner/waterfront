import { computeTakeoff, MATERIAL_LABELS } from '../materialRules.js'
import { money } from '../format.js'

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
        const t = computeTakeoff(job, config)
        return (
          <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wf-line bg-white p-4 shadow-sm">
            <button onClick={() => onOpen(job.id)} className="min-w-0 flex-1 text-left">
              <div className="truncate font-semibold text-wf-navy">{job.name || 'Untitled job'}</div>
              <div className="truncate text-sm text-slate-500">
                {job.customer || '—'} · {job.date} · {num(job.inputs.lengthFt)}′×{num(job.inputs.depthFt)}′ ·{' '}
                {MATERIAL_LABELS[job.inputs.material]}
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

function num(v) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
