import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">404</h1>
      <p className="text-sm text-slate-500">We couldn't find the page you're looking for.</p>
      <Link to="/" className="text-sm font-medium text-teal-700 hover:underline">
        Back to directory
      </Link>
    </div>
  )
}
