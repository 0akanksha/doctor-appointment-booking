import { apiRequest, ApiError } from './apiClient'

export async function signup({ name, email, password }) {
  return apiRequest('/api/auth/signup', { method: 'POST', body: { name, email, password } })
}

export async function login({ email, password }) {
  return apiRequest('/api/auth/login', { method: 'POST', body: { email, password } })
}

export async function logout() {
  await apiRequest('/api/auth/logout', { method: 'POST' })
}

export async function getCurrentUser() {
  try {
    return await apiRequest('/api/auth/me')
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}
