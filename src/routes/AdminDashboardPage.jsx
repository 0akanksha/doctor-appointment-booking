import { useEffect, useState } from 'react'
import { getAllAppointmentsForAdmin } from '../services/adminService'
import { formatSlotDate, formatSlotTime } from '../utils/dateUtils'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Booked', value: 'booked' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function AdminDashboardPage() {
  const [status, setStatus] = useState('')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getAllAppointmentsForAdmin({ status: status || undefined })
      .then((result) => {
        if (active) setAppointments(result)
      })
      .catch(() => {
        if (active) setError('Something went wrong loading appointments. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [status])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Every booking across all doctors and patients.</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Specialty</th>
                <th className="px-4 py-3">Date &amp; time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{appointment.patientName}</div>
                    <div className="text-slate-500">{appointment.patientContact}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{appointment.doctorName}</td>
                  <td className="px-4 py-3 text-slate-700">{appointment.specialty}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {formatSlotDate(appointment.slotDate)} &middot; {formatSlotTime(appointment.slotTime)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {appointment.status === 'cancelled' ? 'Cancelled' : 'Booked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
