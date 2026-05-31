// Local-first persistence. Everything lives in localStorage — no backend, no
// auth, no database. Two keys: the editable config, and the list of saved jobs.
import { DEFAULT_CONFIG } from './materialRules.js'
import { defaultQuote } from './quote.js'
import { defaultLabor } from './labor.js'
import { nowISO } from './format.js'

const CONFIG_KEY = 'wf_config_v1'
const JOBS_KEY = 'wf_jobs_v1'
const COUNTER_KEY = 'wf_jobno_v1'

// Sequential, human-friendly job numbers (WF-1001, WF-1002, …). The counter
// persists in localStorage and only ever moves forward.
export function nextJobNumber() {
  let n = parseInt(localStorage.getItem(COUNTER_KEY) || '1000', 10)
  if (!Number.isFinite(n)) n = 1000
  n += 1
  localStorage.setItem(COUNTER_KEY, String(n))
  return n
}

export function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY))
    // Merge over defaults so newly-added config keys always have a value.
    return { ...DEFAULT_CONFIG, ...(saved || {}) }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}

export function loadJobs() {
  try {
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY)) || []
    return jobs.map(normalizeJob)
  } catch {
    return []
  }
}

// Migrate older saved jobs forward so nothing breaks across feature additions:
// - single-deck ({inputs}) -> component model ({components})
// - backfill jobNumber / version / timestamps / quote
function normalizeJob(job) {
  let j = job
  if (!j.components) {
    const { inputs, overrides, ...rest } = j
    j = inputs
      ? { ...rest, components: [{ id: 'legacy_deck', type: 'deck', label: 'Deck section', inputs, overrides: overrides || {} }] }
      : { ...rest, components: [] }
  }
  if (!j.jobNumber) j = { ...j, jobNumber: nextJobNumber() }
  if (!j.version) j = { ...j, version: 1 }
  if (!j.createdAt) j = { ...j, createdAt: j.date ? `${j.date}T00:00:00.000Z` : nowISO() }
  if (!j.updatedAt) j = { ...j, updatedAt: j.createdAt }
  if (!j.quote) j = { ...j, quote: defaultQuote() }
  if (!j.labor) j = { ...j, labor: defaultLabor() }
  if (!j.revisions) j = { ...j, revisions: [] }
  return j
}

export function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

// Simple unique id without external deps.
export function newId() {
  return 'job_' + Math.abs(hashStr(JSON.stringify(loadJobs()) + performance.now())).toString(36)
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return h
}
