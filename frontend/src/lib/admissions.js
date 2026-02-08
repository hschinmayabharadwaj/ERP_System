// Admissions Service
import api from './api'

export const admissionsService = {
  // Get all admissions with filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return api.get(`/admissions?${queryParams}`)
  },

  // Get admission by ID
  getById: async (id) => {
    return api.get(`/admissions/${id}`)
  },

  // Create new admission application
  create: async (admissionData) => {
    return api.post('/admissions', admissionData)
  },

  // Update admission status
  updateStatus: async (id, status, note) => {
    return api.put(`/admissions/${id}/status`, { status, note })
  },

  // Schedule interview
  scheduleInterview: async (id, interviewData) => {
    return api.put(`/admissions/${id}/interview`, interviewData)
  },

  // Convert admission to student
  convertToStudent: async (id) => {
    return api.post(`/admissions/${id}/convert`, {})
  },

  // Get admission statistics
  getStats: async () => {
    return api.get('/admissions/stats/overview')
  }
}

export default admissionsService
