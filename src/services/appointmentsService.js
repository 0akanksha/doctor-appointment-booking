import { apiRequest } from './apiClient'
import { SlotUnavailableError, NotFoundError } from './errors'

export async function createAppointment({ doctorId, slotId, notes }) {
  try {
    return await apiRequest('/api/appointments', {
      method: 'POST',
      body: { doctorId, slotId, notes },
    })
  } catch (err) {
    if (err.status === 409) throw new SlotUnavailableError()
    if (err.status === 404) throw new NotFoundError(err.message)
    throw err
  }
}

export async function getMyAppointments() {
  return apiRequest('/api/appointments/me')
}

export async function getAppointmentById(appointmentId) {
  try {
    return await apiRequest(`/api/appointments/${appointmentId}`)
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function cancelAppointment(appointmentId) {
  try {
    return await apiRequest(`/api/appointments/${appointmentId}/cancel`, { method: 'PATCH' })
  } catch (err) {
    if (err.status === 404) throw new NotFoundError(err.message)
    throw err
  }
}
