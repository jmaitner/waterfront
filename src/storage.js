// Local-first persistence. Everything lives in localStorage — no backend, no
// auth, no database. Two keys: the editable config, and the list of saved jobs.
import { DEFAULT_CONFIG } from './materialRules.js'

const CONFIG_KEY = 'wf_config_v1'
const JOBS_KEY = 'wf_jobs_v1'

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
    return JSON.parse(localStorage.getItem(JOBS_KEY)) || []
  } catch {
    return []
  }
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
