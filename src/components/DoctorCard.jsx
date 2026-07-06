import { Link } from 'react-router-dom'
import AvatarInitials from './AvatarInitials'

export default function DoctorCard({ doctor }) {
  const availableCount = doctor.slots.filter((s) => !s.isBooked).length

  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <AvatarInitials name={doctor.name} />
        <div>
          <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
          <span className="inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            {doctor.specialty}
          </span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{doctor.bio}</p>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-slate-500">{doctor.yearsExperience} yrs experience</span>
        <span className="font-medium text-teal-700">
          {availableCount > 0 ? `${availableCount} slots open` : 'Fully booked'}
        </span>
      </div>
    </Link>
  )
}
