// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000/api/py'

// Token management
let accessToken = localStorage.getItem('accessToken')
let refreshToken = localStorage.getItem('refreshToken')

export const setTokens = (access, refresh) => {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}

export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const getAccessToken = () => accessToken

// Base fetch wrapper with auth
const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let response = await fetch(url, { ...options, headers })

  // Handle token refresh on 401
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      if (refreshResponse.ok) {
        const tokens = await refreshResponse.json()
        setTokens(tokens.accessToken, tokens.refreshToken)
        
        headers['Authorization'] = `Bearer ${tokens.accessToken}`
        response = await fetch(url, { ...options, headers })
      } else {
        clearTokens()
        window.location.href = '/login'
      }
    } catch {
      clearTokens()
      window.location.href = '/login'
    }
  }

  return response
}

// Generic API methods
const api = {
  get: async (endpoint, isPython = false) => {
    const baseUrl = isPython ? PYTHON_API_URL : API_BASE_URL
    const response = await fetchWithAuth(`${baseUrl}${endpoint}`)
    if (!response.ok) throw new Error((await response.json()).error || 'Request failed')
    return response.json()
  },

  post: async (endpoint, data, isPython = false) => {
    const baseUrl = isPython ? PYTHON_API_URL : API_BASE_URL
    const response = await fetchWithAuth(`${baseUrl}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error((await response.json()).error || 'Request failed')
    return response.json()
  },

  put: async (endpoint, data, isPython = false) => {
    const baseUrl = isPython ? PYTHON_API_URL : API_BASE_URL
    const response = await fetchWithAuth(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error((await response.json()).error || 'Request failed')
    return response.json()
  },

  delete: async (endpoint, isPython = false) => {
    const baseUrl = isPython ? PYTHON_API_URL : API_BASE_URL
    const response = await fetchWithAuth(`${baseUrl}${endpoint}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error((await response.json()).error || 'Request failed')
    return response.json()
  },

  // For file downloads
  download: async (endpoint, filename, isPython = false) => {
    const baseUrl = isPython ? PYTHON_API_URL : API_BASE_URL
    const response = await fetchWithAuth(`${baseUrl}${endpoint}`)
    if (!response.ok) throw new Error('Download failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}

export default api
