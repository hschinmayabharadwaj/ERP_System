// Analytics Service (Python API)
import api from './api'

export const analyticsService = {
  // Get comprehensive analytics overview
  getOverview: async () => {
    return api.get('/analytics/overview', true)
  },

  // Get trends data
  getTrends: async (period = '6m', metric = 'all') => {
    return api.get(`/analytics/trends?period=${period}&metric=${metric}`, true)
  },

  // Get predictions
  getPredictions: async () => {
    return api.get('/analytics/predictions', true)
  },

  // Get financial summary
  getFinancialSummary: async (academicYear) => {
    const params = academicYear ? `?academic_year=${academicYear}` : ''
    return api.get(`/reports/financial/summary${params}`, true)
  },

  // Get hostel occupancy report
  getHostelReport: async () => {
    return api.get('/reports/hostel/occupancy', true)
  },

  // Export students
  exportStudents: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/students/export?${queryParams}`, `students.${format}`, true)
  },

  // Export fees
  exportFees: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/fees/export?${queryParams}`, `fees.${format}`, true)
  },

  // Export payments
  exportPayments: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/payments/export?${queryParams}`, `payments.${format}`, true)
  }
}

export default analyticsService
