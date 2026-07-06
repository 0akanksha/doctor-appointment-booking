import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getDoctorById, getAvailableSlots } from '../services/doctorsService'
import AvatarInitials from '../components/AvatarInitials'
import SlotPicker from '../components/SlotPicker'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'

export default function DoctorDetailPage() {
  const { doctorId } = useParams()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([getDoctorById(doctorId), getAvailableSlots(doctorId)])
      .then(([doctorResult, slotsResult]) => {
        if (!active) return
        setDoctor(doctorResult)
        setSlots(slotsResult)
      })
      .catch(() => {
        if (active) setError('Something went wrong loading this doctor. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [doctorId])

  if (loading) return <LoadingSpinner label="Loading doctor..." />
  if (error) return <ErrorBanner message={error} />

  if (!doctor) {
    return (
      <EmptyState
        title="Doctor not found"
        subtitle="This doctor may no longer be available."
        action={
          <Link to="/" className="text-sm font-medium text-teal-700 hover:underline">
            Back to directory
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Link to="/" className="text-sm font-medium text-slate-500 hover:text-teal-700">
        &larr; Back to directory
      </Link>

      <div className="flex items-start gap-4">
        <AvatarInitials name={doctor.name} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{doctor.name}</h1>
          <span className="mt-1 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            {doctor.specialty}
          </span>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">{doctor.bio}</p>
          <p className="mt-1 text-sm text-slate-500">{doctor.yearsExperience} years of experience</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Available appointments</h2>
        {slots.length === 0 ? (
          <EmptyState title="No available slots" subtitle="Please check back later or try another doctor." />
        ) : (
          <SlotPicker
            slots={slots}
            selectedSlotId={null}
            onSelectSlot={(slot) => navigate(`/doctors/${doctor.id}/book?slotId=${slot.id}`)}
          />
        )}
      </div>
    </div>
  )
}
