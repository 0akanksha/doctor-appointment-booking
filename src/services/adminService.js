import { apiRequest } from './apiClient'

export async function getAllAppointmentsForAdmin({ status } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)

  const query = params.toString()
  return apiRequest(`/api/admin/appointments${query ? `?${query}` : ''}`)
}
