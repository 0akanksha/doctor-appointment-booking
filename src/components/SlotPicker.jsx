import { groupSlotsByDate, formatSlotDate, formatSlotTime } from '../utils/dateUtils'

export default function SlotPicker({ slots, selectedSlotId, onSelectSlot }) {
  const groups = groupSlotsByDate(slots)

  return (
    <div className="flex flex-col gap-5">
      {groups.map(({ date, slots: dateSlots }) => (
        <div key={date}>
          <p className="mb-2 text-sm font-medium text-slate-700">{formatSlotDate(date)}</p>
          <div className="flex flex-wrap gap-2">
            {dateSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedSlotId === slot.id
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {formatSlotTime(slot.time)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
