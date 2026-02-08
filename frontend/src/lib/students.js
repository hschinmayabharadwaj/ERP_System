// Students Service
import api from './api'

export const studentsService = {
  // Get all students with pagination and filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return api.get(`/students?${queryParams}`)
  },

  // Get student by ID
  getById: async (id) => {
    return api.get(`/students/${id}`)
  },

  // Create new student
  create: async (studentData) => {
    return api.post('/students', studentData)
  },

  // Update student
  update: async (id, studentData) => {
    return api.put(`/students/${id}`, studentData)
  },

  // Delete student
  delete: async (id) => {
    return api.delete(`/students/${id}`)
  },

  // Get statistics
  getStats: async () => {
    return api.get('/students/stats/overview')
  },

  // Export students (Python API)
  export: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters })
    return api.download(`/reports/students/export?${queryParams}`, `students.${format}`, true)
  }
}

export default studentsService
