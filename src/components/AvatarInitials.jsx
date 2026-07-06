const PALETTE = [
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
]

function colorForName(name) {
  const index = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % PALETTE.length
  return PALETTE[index]
}

function initialsForName(name) {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function AvatarInitials({ name, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-12 w-12 text-base'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${colorForName(name)} ${sizeClasses}`}
      aria-hidden="true"
    >
      {initialsForName(name)}
    </div>
  )
}
