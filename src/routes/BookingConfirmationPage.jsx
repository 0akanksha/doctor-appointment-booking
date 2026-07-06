import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAppointmentById } from '../services/appointmentsService'
import { formatSlotDate, formatSlotTime } from '../utils/dateUtils'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function BookingConfirmationPage() {
  const { appointmentId } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getAppointmentById(appointmentId).then((result) => {
      if (active) {
        setAppointment(result)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [appointmentId])

  if (loading) return <LoadingSpinner label="Loading confirmation..." />

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        action={
          <Link to="/" className="text-sm font-medium text-teal-700 hover:underline">
            Back to directory
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Appointment confirmed</h1>
      <p className="text-sm text-slate-600">
        You're booked with <span className="font-medium">{appointment.doctorName}</span> (
        {appointment.specialty}) on {formatSlotDate(appointment.slotDate)} at{' '}
        {formatSlotTime(appointment.slotTime)}.
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          to="/my-appointments"
          className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          View my appointments
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Book another
        </Link>
      </div>
    </div>
  )
}
