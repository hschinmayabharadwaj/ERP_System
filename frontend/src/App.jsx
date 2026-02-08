import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/ui/loading-screen'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Students = lazy(() => import('./pages/Students'))
const StudentDetail = lazy(() => import('./pages/StudentDetail'))
const Admissions = lazy(() => import('./pages/Admissions'))
const Fees = lazy(() => import('./pages/Fees'))
const Payments = lazy(() => import('./pages/Payments'))
const Hostel = lazy(() => import('./pages/Hostel'))
const Reports = lazy(() => import('./pages/Reports'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="fees" element={<Fees />} />
          <Route path="payments" element={<Payments />} />
          <Route path="hostel" element={<Hostel />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
