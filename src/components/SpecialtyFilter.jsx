export default function SpecialtyFilter({ specialties, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    >
      <option value="">All specialties</option>
      {specialties.map((specialty) => (
        <option key={specialty} value={specialty}>
          {specialty}
        </option>
      ))}
    </select>
  )
}
