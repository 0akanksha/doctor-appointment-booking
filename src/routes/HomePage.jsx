import { useEffect, useState } from 'react'
import { getDoctors, getSpecialties } from '../services/doctorsService'
import DoctorCard from '../components/DoctorCard'
import SearchBar from '../components/SearchBar'
import SpecialtyFilter from '../components/SpecialtyFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSpecialties().then(setSpecialties)
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getDoctors({ search, specialty })
      .then((result) => {
        if (active) setDoctors(result)
      })
      .catch(() => {
        if (active) setError('Something went wrong loading doctors. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [search, specialty])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Find a doctor</h1>
        <p className="mt-1 text-sm text-slate-500">Search by name or filter by specialty to book an appointment.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} />
        <SpecialtyFilter specialties={specialties} value={specialty} onChange={setSpecialty} />
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading doctors..." />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          subtitle="Try a different search term or clear the specialty filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}
