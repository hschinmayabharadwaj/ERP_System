// Fees Service
import api from './api'

export const feesService = {
  // Get all fee records with filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return api.get(`/fees?${queryParams}`)
  },

  // Get fee by ID
  getById: async (id) => {
    return api.get(`/fees/${id}`)
  },

  // Create fee record
  create: async (feeData) => {
    return api.post('/fees', feeData)
  },

  // Update fee record
  update: async (id, feeData) => {
    return api.put(`/fees/${id}`, feeData)
  },

  // Get student's fee history
  getStudentFees: async (studentId) => {
    return api.get(`/fees/student/${studentId}`)
  },

  // Get fee statistics
  getStats: async () => {
    return api.get('/fees/stats/overview')
  },

  // Export fees (Python API)
  export: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/fees/export?${queryParams}`, `fees.${format}`, true)
  }
}

export default feesService
