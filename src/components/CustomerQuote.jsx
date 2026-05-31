import Brand from './Brand.jsx'
import { money } from '../format.js'
import { jobNoLabel, addDaysISO } from '../format.js'

// The customer-facing document. Prices only — no cost, no margin, no leftover.
// Prints clean via the browser (the print stylesheet hides everything else).
export default function CustomerQuote({ job, quoted }) {
  const validUntil = addDaysISO(job.date, job.quote.validDays)
  return (
    <div className="print-area rounded-xl border border-wf-line bg-white p-6 shadow-sm sm:p-8">
      <header className="flex items-start justify-between border-b-2 border-wf-navy pb-4">
        <div>
          <Brand />
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Project Quote</p>
        </div>
        <div className="max-w-[55%] text-right text-sm">
          <div className="text-lg font-bold text-wf-navy">{job.name || 'Untitled project'}</div>
          <div className="text-slate-600">{job.customer || '—'}</div>
          <div className="mt-1 text-xs text-slate-500">
            {jobNoLabel(job.jobNumber)} · Rev {job.version} · {job.date}
          </div>
          <div className="text-xs text-slate-400">Valid through {validUntil}</div>
        </div>
      </header>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-wf-line text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-2 font-semibold">Description</th>
            <th className="py-2 pl-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {quoted.lines.map((l) => (
            <tr key={l.id} className="border-b border-wf-line/50">
              <td className="py-2.5 pr-2 text-wf-navy">{l.label || '—'}</td>
              <td className="py-2.5 pl-2 text-right tabular-nums text-wf-navy">{money(l.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 pr-2 text-right text-slate-500">Subtotal</td>
            <td className="py-2 pl-2 text-right tabular-nums text-slate-600">{money(quoted.subtotal)}</td>
          </tr>
          {quoted.tax > 0 && (
            <tr>
              <td className="py-1 pr-2 text-right text-slate-500">Tax ({job.quote.taxPct}%)</td>
              <td className="py-1 pl-2 text-right tabular-nums text-slate-600">{money(quoted.tax)}</td>
            </tr>
          )}
          <tr>
            <td className="border-t-2 border-wf-navy py-3 pr-2 text-right text-sm font-bold uppercase tracking-wide text-wf-navy">
              Total
            </td>
            <td className="border-t-2 border-wf-navy py-3 pl-2 text-right text-2xl font-bold tabular-nums text-wf-navy">
              {money(quoted.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {job.quote.notes && (
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wide text-wf-blue">Notes</h4>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{job.quote.notes}</p>
        </div>
      )}

      <footer className="mt-6 border-t border-wf-line pt-4 text-[11px] leading-relaxed text-slate-400">
        Thank you for considering Waterfront Solutions — West Michigan deck &amp; stair builders. This
        quote is valid through {validUntil}. Pricing is an estimate based on the scope above; final
        cost may change if the scope or site conditions change. A signed agreement and deposit are
        required to schedule work.
      </footer>
    </div>
  )
}
