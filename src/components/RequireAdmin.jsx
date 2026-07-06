import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

export default function RequireAdmin() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner label="Checking your session..." />

  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />
  }

  if (user.role !== 'admin') {
    return <EmptyState title="Access denied" subtitle="You don't have permission to view this page." />
  }

  return <Outlet />
}
