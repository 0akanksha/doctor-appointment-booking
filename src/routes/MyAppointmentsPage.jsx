import { useEffect, useState } from 'react'
import { getMyAppointments, cancelAppointment } from '../services/appointmentsService'
import AppointmentCard from '../components/AppointmentCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  async function loadAppointments() {
    setLoading(true)
    setError('')

    try {
      const results = await getMyAppointments()
      setAppointments(results)
    } catch {
      setError('Something went wrong loading your appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  async function handleCancel(appointmentId) {
    if (!window.confirm('Cancel this appointment?')) return

    setCancellingId(appointmentId)
    try {
      await cancelAppointment(appointmentId)
      await loadAppointments()
    } catch {
      setError('Something went wrong cancelling this appointment. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My appointments</h1>
        <p className="mt-1 text-sm text-slate-500">Your upcoming and past bookings.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading your appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments yet" subtitle="Book an appointment with a doctor to see it here." />
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={handleCancel}
              cancelling={cancellingId === appointment.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
