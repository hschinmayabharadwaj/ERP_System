// Authentication Service
import api, { setTokens, clearTokens, getAccessToken } from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    setTokens(response.accessToken, response.refreshToken)
    return response.user
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    setTokens(response.accessToken, response.refreshToken)
    return response.user
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      clearTokens()
    }
  },

  getCurrentUser: async () => {
    if (!getAccessToken()) return null
    const response = await api.get('/auth/me')
    return response.user
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.user
  },

  changePassword: async (currentPassword, newPassword) => {
    return api.put('/auth/change-password', { currentPassword, newPassword })
  },

  isAuthenticated: () => !!getAccessToken()
}

export default authService
