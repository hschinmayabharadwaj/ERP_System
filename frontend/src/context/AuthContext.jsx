import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

// Google Client ID - Replace with your actual client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('erp_user')
      const storedToken = localStorage.getItem('erp_token')
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)
          // Check if token is expired
          const decoded = jwtDecode(storedToken)
          const isExpired = decoded.exp * 1000 < Date.now()
          
          if (!isExpired) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Token expired, clear storage
            localStorage.removeItem('erp_user')
            localStorage.removeItem('erp_token')
          }
        } catch (error) {
          console.error('Error checking auth:', error)
          localStorage.removeItem('erp_user')
          localStorage.removeItem('erp_token')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Handle Google Sign-In with credential token
  const loginWithGoogle = useCallback(async (credential) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const decoded = jwtDecode(credential)
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        picture: decoded.picture,
        emailVerified: decoded.email_verified
      }

      // Store in localStorage
      localStorage.setItem('erp_user', JSON.stringify(userData))
      localStorage.setItem('erp_token', credential)

      // Optional: Send to backend to create/update user record
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
            userData
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            userData.role = data.user.role || 'user'
          }
        }
      } catch (backendError) {
        console.log('Backend auth sync skipped:', backendError.message)
      }

      setUser(userData)
      setIsAuthenticated(true)
      setIsLoading(false)
      
      return { success: true, user: userData }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
      return { success: false, error: err.message }
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    localStorage.removeItem('erp_user')
    localStorage.removeItem('erp_token')
    
    // Revoke Google token if available
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  }, [])

  // Get auth token
  const getToken = useCallback(() => {
    return localStorage.getItem('erp_token')
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    logout,
    getToken,
    googleClientId: GOOGLE_CLIENT_ID
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
