import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import PageContainer from './components/layout/PageContainer'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'
import HomePage from './routes/HomePage'
import DoctorDetailPage from './routes/DoctorDetailPage'
import BookingPage from './routes/BookingPage'
import BookingConfirmationPage from './routes/BookingConfirmationPage'
import MyAppointmentsPage from './routes/MyAppointmentsPage'
import SignupPage from './routes/SignupPage'
import LoginPage from './routes/LoginPage'
import AdminDashboardPage from './routes/AdminDashboardPage'
import NotFoundPage from './routes/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <NavBar />
          <PageContainer>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
              <Route path="/appointments/:appointmentId/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<RequireAuth />}>
                <Route path="/doctors/:doctorId/book" element={<BookingPage />} />
                <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              </Route>

              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageContainer>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
