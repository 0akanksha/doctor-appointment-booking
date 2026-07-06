import { NavLink, useNavigate } from 'react-router-dom'
import { resetDemoData } from '../../services/doctorsService'
import { useAuth } from '../../contexts/AuthContext'

const linkClasses = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 text-slate-900">
          <span className="text-lg font-semibold">MediBook</span>
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClasses} end>
            Find a Doctor
          </NavLink>
          {user && (
            <NavLink to="/my-appointments" className={linkClasses}>
              My Appointments
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClasses}>
              Admin
            </NavLink>
          )}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-sm text-slate-600">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-1">
              <NavLink to="/login" className={linkClasses}>
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Sign up
              </NavLink>
            </div>
          )}

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo data? This clears bookings and reseeds doctors.')) {
                  resetDemoData()
                }
              }}
              className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
              title="Dev only: clears demo data and reseeds doctors + admin account"
            >
              Reset Demo Data
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
