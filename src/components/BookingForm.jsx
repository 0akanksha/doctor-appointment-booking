import { useState } from 'react'

export default function BookingForm({ user, onSubmit, submitting }) {
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ notes })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
        Booking as <span className="font-medium">{user.name}</span> ({user.email})
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
          Reason for visit <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          placeholder="Briefly describe your reason for visiting"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Booking...' : 'Confirm appointment'}
      </button>
    </form>
  )
}
