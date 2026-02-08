// Payments Service
import api from './api'

export const paymentsService = {
  // Get all payments with filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return api.get(`/payments?${queryParams}`)
  },

  // Get payment by ID
  getById: async (id) => {
    return api.get(`/payments/${id}`)
  },

  // Record new payment
  create: async (paymentData) => {
    return api.post('/payments', paymentData)
  },

  // Get student's payment history
  getStudentPayments: async (studentId) => {
    return api.get(`/payments/student/${studentId}`)
  },

  // Get payment statistics
  getStats: async () => {
    return api.get('/payments/stats/overview')
  },

  // Export payments (Python API)
  export: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/payments/export?${queryParams}`, `payments.${format}`, true)
  }
}

export default paymentsService
