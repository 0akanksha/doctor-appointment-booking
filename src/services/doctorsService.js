import { apiRequest } from './apiClient'

// Seeding is now a one-time backend step (`npm run db:seed`); kept as a
// no-op so main.jsx (bootstrap code, not a page/component) needs no edit.
export function seedDoctorsIfNeeded() {}

export async function resetDemoData() {
  await apiRequest('/api/dev/reset', { method: 'POST' })
  window.location.reload()
}

export async function getDoctors({ search, specialty } = {}) {
  const params = new URLSearchParams()
  if (search?.trim()) params.set('search', search.trim())
  if (specialty?.trim()) params.set('specialty', specialty.trim())

  const query = params.toString()
  return apiRequest(`/api/doctors${query ? `?${query}` : ''}`)
}

export async function getDoctorById(doctorId) {
  try {
    return await apiRequest(`/api/doctors/${doctorId}`)
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function getSpecialties() {
  return apiRequest('/api/specialties')
}

export async function getAvailableSlots(doctorId) {
  try {
    return await apiRequest(`/api/doctors/${doctorId}/slots`)
  } catch (err) {
    if (err.status === 404) return []
    throw err
  }
}
