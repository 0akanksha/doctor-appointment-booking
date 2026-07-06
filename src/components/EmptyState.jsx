export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <p className="text-lg font-medium text-slate-700">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-slate-500">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
