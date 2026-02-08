// Dashboard Service
import api from './api'

export const dashboardService = {
  // Get dashboard overview
  getOverview: async () => {
    return api.get('/dashboard/overview')
  },

  // Get enrollment trends
  getEnrollmentTrends: async () => {
    return api.get('/dashboard/trends/enrollment')
  },

  // Get fee collection trends
  getFeeTrends: async () => {
    return api.get('/dashboard/trends/fees')
  },

  // Get course distribution
  getCourseDistribution: async () => {
    return api.get('/dashboard/distribution/courses')
  },

  // Get quick stats
  getQuickStats: async () => {
    return api.get('/dashboard/quick-stats')
  }
}

export default dashboardService
