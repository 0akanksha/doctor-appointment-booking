export function formatSlotDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatSlotTime(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function groupSlotsByDate(slots) {
  const groups = new Map()
  for (const slot of slots) {
    if (!groups.has(slot.date)) groups.set(slot.date, [])
    groups.get(slot.date).push(slot)
  }
  return [...groups.entries()].map(([date, dateSlots]) => ({ date, slots: dateSlots }))
}
