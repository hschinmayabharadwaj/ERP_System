// React Query hooks for data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  studentsService,
  feesService,
  paymentsService,
  hostelService,
  admissionsService,
  dashboardService,
  analyticsService
} from './services'

// ==================== STUDENTS ====================

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentsService.getAll(params),
  })
}

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.getById(id),
    enabled: !!id,
  })
}

export const useStudentStats = () => {
  return useQuery({
    queryKey: ['studentStats'],
    queryFn: () => studentsService.getStats(),
  })
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['studentStats'] })
    },
  })
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => studentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student', id] })
    },
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['studentStats'] })
    },
  })
}

// ==================== FEES ====================

export const useFees = (params = {}) => {
  return useQuery({
    queryKey: ['fees', params],
    queryFn: () => feesService.getAll(params),
  })
}

export const useFee = (id) => {
  return useQuery({
    queryKey: ['fee', id],
    queryFn: () => feesService.getById(id),
    enabled: !!id,
  })
}

export const useStudentFees = (studentId) => {
  return useQuery({
    queryKey: ['studentFees', studentId],
    queryFn: () => feesService.getStudentFees(studentId),
    enabled: !!studentId,
  })
}

export const useFeeStats = () => {
  return useQuery({
    queryKey: ['feeStats'],
    queryFn: () => feesService.getStats(),
  })
}

export const useCreateFee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: feesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] })
      queryClient.invalidateQueries({ queryKey: ['feeStats'] })
    },
  })
}

// ==================== PAYMENTS ====================

export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsService.getAll(params),
  })
}

export const usePayment = (id) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsService.getById(id),
    enabled: !!id,
  })
}

export const useStudentPayments = (studentId) => {
  return useQuery({
    queryKey: ['studentPayments', studentId],
    queryFn: () => paymentsService.getStudentPayments(studentId),
    enabled: !!studentId,
  })
}

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['paymentStats'],
    queryFn: () => paymentsService.getStats(),
  })
}

export const useCreatePayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: paymentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['fees'] })
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] })
      queryClient.invalidateQueries({ queryKey: ['feeStats'] })
    },
  })
}

// ==================== HOSTEL ====================

export const useRooms = (params = {}) => {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => hostelService.getRooms(params),
  })
}

export const useRoom = (id) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => hostelService.getRoomById(id),
    enabled: !!id,
  })
}

export const useHostelBlocks = () => {
  return useQuery({
    queryKey: ['hostelBlocks'],
    queryFn: () => hostelService.getBlocks(),
  })
}

export const useHostelStats = () => {
  return useQuery({
    queryKey: ['hostelStats'],
    queryFn: () => hostelService.getStats(),
  })
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: hostelService.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['hostelStats'] })
    },
  })
}

export const useAllocateRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, studentId }) => hostelService.allocateRoom(roomId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['hostelStats'] })
    },
  })
}

export const useDeallocateRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, studentId }) => hostelService.deallocateRoom(roomId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['hostelStats'] })
    },
  })
}

// ==================== ADMISSIONS ====================

export const useAdmissions = (params = {}) => {
  return useQuery({
    queryKey: ['admissions', params],
    queryFn: () => admissionsService.getAll(params),
  })
}

export const useAdmission = (id) => {
  return useQuery({
    queryKey: ['admission', id],
    queryFn: () => admissionsService.getById(id),
    enabled: !!id,
  })
}

export const useAdmissionStats = () => {
  return useQuery({
    queryKey: ['admissionStats'],
    queryFn: () => admissionsService.getStats(),
  })
}

export const useCreateAdmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: admissionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] })
    },
  })
}

export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }) => admissionsService.updateStatus(id, status, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      queryClient.invalidateQueries({ queryKey: ['admission', id] })
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] })
    },
  })
}

export const useConvertAdmission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: admissionsService.convertToStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] })
    },
  })
}

// ==================== DASHBOARD ====================

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => dashboardService.getOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEnrollmentTrends = () => {
  return useQuery({
    queryKey: ['enrollmentTrends'],
    queryFn: () => dashboardService.getEnrollmentTrends(),
  })
}

export const useFeeTrends = () => {
  return useQuery({
    queryKey: ['feeTrends'],
    queryFn: () => dashboardService.getFeeTrends(),
  })
}

export const useCourseDistribution = () => {
  return useQuery({
    queryKey: ['courseDistribution'],
    queryFn: () => dashboardService.getCourseDistribution(),
  })
}

export const useQuickStats = () => {
  return useQuery({
    queryKey: ['quickStats'],
    queryFn: () => dashboardService.getQuickStats(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// ==================== ANALYTICS (Python API) ====================

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: () => analyticsService.getOverview(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAnalyticsTrends = (period = '6m', metric = 'all') => {
  return useQuery({
    queryKey: ['analyticsTrends', period, metric],
    queryFn: () => analyticsService.getTrends(period, metric),
  })
}

export const usePredictions = () => {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: () => analyticsService.getPredictions(),
  })
}

export const useFinancialSummary = (academicYear) => {
  return useQuery({
    queryKey: ['financialSummary', academicYear],
    queryFn: () => analyticsService.getFinancialSummary(academicYear),
  })
}

export const useHostelOccupancyReport = () => {
  return useQuery({
    queryKey: ['hostelOccupancyReport'],
    queryFn: () => analyticsService.getHostelReport(),
  })
}
