import { DOCTORS_KEY, APPOINTMENTS_KEY } from '../constants/storageKeys'

export function readCollection(key) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeCollection(key, items) {
  window.localStorage.setItem(key, JSON.stringify(items))
}

export function ensureSeeded(key, seedFn) {
  const existing = readCollection(key)
  if (existing.length === 0) {
    writeCollection(key, seedFn())
  }
}

export function resetAll() {
  window.localStorage.removeItem(DOCTORS_KEY)
  window.localStorage.removeItem(APPOINTMENTS_KEY)
}
