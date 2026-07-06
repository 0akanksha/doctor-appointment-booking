import { formatSlotDate, formatSlotTime } from '../utils/dateUtils'

export default function AppointmentCard({ appointment, onCancel, cancelling }) {
  const isCancelled = appointment.status === 'cancelled'

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900">{appointment.doctorName}</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isCancelled ? 'Cancelled' : 'Booked'}
          </span>
        </div>
        <p className="text-sm text-slate-500">{appointment.specialty}</p>
        <p className="mt-1 text-sm text-slate-700">
          {formatSlotDate(appointment.slotDate)} &middot; {formatSlotTime(appointment.slotTime)}
        </p>
      </div>
      {!isCancelled && (
        <button
          type="button"
          onClick={() => onCancel(appointment.id)}
          disabled={cancelling}
          className="self-start rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
        >
          {cancelling ? 'Cancelling...' : 'Cancel'}
        </button>
      )}
    </div>
  )
}
