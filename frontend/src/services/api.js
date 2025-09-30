// API service for making HTTP requests to the backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const feeAPI = {
  getAll: () => api.get('/fees'),
  getByStudentId: (studentId) => api.get(`/fees/student/${studentId}`),
  create: (data) => api.post('/fees', data),
  update: (id, data) => api.put(`/fees/${id}`, data),
  processPayment: (id, paymentData) => api.post(`/fees/${id}/payment`, paymentData),
};

export const hostelAPI = {
  getRooms: () => api.get('/hostel/rooms'),
  getBookings: () => api.get('/hostel/bookings'),
  createBooking: (data) => api.post('/hostel/bookings', data),
  updateRoom: (id, data) => api.put(`/hostel/rooms/${id}`, data),
};

export const reportAPI = {
  getStudentReport: (params) => api.get('/reports/students', { params }),
  getFeeReport: (params) => api.get('/reports/fees', { params }),
  getHostelReport: (params) => api.get('/reports/hostel', { params }),
  downloadReport: (type, params) => api.get(`/reports/${type}/download`, { 
    params, 
    responseType: 'blob' 
  }),
};

export default api;