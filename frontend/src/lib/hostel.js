// Hostel Service
import api from './api'

export const hostelService = {
  // ==================== ROOMS ====================
  
  // Get all rooms with filters
  getRooms: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return api.get(`/hostel/rooms?${queryParams}`)
  },

  // Get room by ID
  getRoomById: async (id) => {
    return api.get(`/hostel/rooms/${id}`)
  },

  // Create room
  createRoom: async (roomData) => {
    return api.post('/hostel/rooms', roomData)
  },

  // Update room
  updateRoom: async (id, roomData) => {
    return api.put(`/hostel/rooms/${id}`, roomData)
  },

  // Allocate room to student
  allocateRoom: async (roomId, studentId) => {
    return api.post(`/hostel/rooms/${roomId}/allocate`, { studentId })
  },

  // Deallocate room from student
  deallocateRoom: async (roomId, studentId) => {
    return api.post(`/hostel/rooms/${roomId}/deallocate`, { studentId })
  },

  // ==================== BLOCKS ====================
  
  // Get all blocks
  getBlocks: async () => {
    return api.get('/hostel/blocks')
  },

  // Create block
  createBlock: async (blockData) => {
    return api.post('/hostel/blocks', blockData)
  },

  // ==================== STATISTICS ====================
  
  // Get hostel statistics
  getStats: async () => {
    return api.get('/hostel/stats/overview')
  },

  // Get detailed occupancy report (Python API)
  getOccupancyReport: async () => {
    return api.get('/reports/hostel/occupancy', true)
  }
}

export default hostelService
