import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { getDoctorById } from '../services/doctorsService'
import { createAppointment } from '../services/appointmentsService'
import { SlotUnavailableError } from '../services/errors'
import { formatSlotDate, formatSlotTime } from '../utils/dateUtils'
import { useAuth } from '../contexts/AuthContext'
import BookingForm from '../components/BookingForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import EmptyState from '../components/EmptyState'

export default function BookingPage() {
  const { doctorId } = useParams()
  const [searchParams] = useSearchParams()
  const slotId = searchParams.get('slotId')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [slot, setSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)

    getDoctorById(doctorId).then((result) => {
      if (!active) return
      setDoctor(result)
      const foundSlot = result?.slots.find((s) => s.id === slotId)
      setSlot(foundSlot && !foundSlot.isBooked ? foundSlot : null)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [doctorId, slotId])

  async function handleSubmit(formValues) {
    setSubmitting(true)
    setError('')

    try {
      const appointment = await createAppointment({
        doctorId,
        slotId,
        ...formValues,
      })
      navigate(`/appointments/${appointment.id}/confirmation`)
    } catch (err) {
      if (err instanceof SlotUnavailableError) {
        setError('This slot was just booked by someone else. Please choose another time.')
        setSlot(null)
      } else {
        setError('Something went wrong booking your appointment. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading appointment details..." />

  if (!doctor || !slot) {
    return (
      <EmptyState
        title="This slot is no longer available"
        subtitle="It may have just been booked. Please pick another time."
        action={
          <Link
            to={`/doctors/${doctorId}`}
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            Back to doctor profile
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Link to={`/doctors/${doctorId}`} className="text-sm font-medium text-slate-500 hover:text-teal-700">
        &larr; Back to doctor profile
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Confirm your appointment</h1>
        <p className="mt-1 text-sm text-slate-600">
          {doctor.name} &middot; {formatSlotDate(slot.date)} at {formatSlotTime(slot.time)}
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <BookingForm user={user} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}
