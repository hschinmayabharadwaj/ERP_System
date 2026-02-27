import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/ui/loading-screen'
import { useAuth } from './context/AuthContext'

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

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingScreen />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Role-based route guard — redirects to dashboard if role not allowed
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const userRole = user?.role || 'staff'

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Route component (redirect to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingScreen />
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<RoleRoute allowedRoles={['admin', 'staff']}><Students /></RoleRoute>} />
          <Route path="students/:id" element={<RoleRoute allowedRoles={['admin', 'staff']}><StudentDetail /></RoleRoute>} />
          <Route path="admissions" element={<RoleRoute allowedRoles={['admin', 'staff']}><Admissions /></RoleRoute>} />
          <Route path="fees" element={<RoleRoute allowedRoles={['admin', 'accountant']}><Fees /></RoleRoute>} />
          <Route path="payments" element={<RoleRoute allowedRoles={['admin', 'accountant']}><Payments /></RoleRoute>} />
          <Route path="hostel" element={<RoleRoute allowedRoles={['admin', 'hostel_warden']}><Hostel /></RoleRoute>} />
          <Route path="reports" element={<RoleRoute allowedRoles={['admin', 'accountant']}><Reports /></RoleRoute>} />
          <Route path="settings" element={<RoleRoute allowedRoles={['admin']}><Settings /></RoleRoute>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
