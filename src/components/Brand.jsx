// Generic, white-label app mark — a neutral wave/deck icon + wordmark, no
// client logo or company name. Swap in your own branding here if you want.
export default function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className={compact ? 'h-9 w-9' : 'h-11 w-11'} aria-hidden="true">
        <rect width="40" height="40" rx="8" fill="#0b2545" />
        <path d="M5 25c3 0 3 2.4 6 2.4S14 25 17 25s3 2.4 6 2.4S26 25 29 25s3 2.4 5 2.4" fill="none" stroke="#5a8fc0" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M5 31c3 0 3 2.4 6 2.4S14 31 17 31s3 2.4 6 2.4S26 31 29 31s3 2.4 5 2.4" fill="none" stroke="#13578c" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="11" y="8" width="18" height="3.4" rx="1.2" fill="#fff" />
        <rect x="13.5" y="11.4" width="2.4" height="8" fill="#fff" />
        <rect x="24" y="11.4" width="2.4" height="8" fill="#fff" />
      </svg>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight text-wf-navy ${compact ? 'text-base' : 'text-xl'}`}>
          Takeoff
        </div>
        <div className={`font-semibold tracking-[0.18em] text-wf-blue ${compact ? 'text-[10px]' : 'text-xs'}`}>
          DECK MATERIALS &amp; QUOTES
        </div>
      </div>
    </div>
  )
}
