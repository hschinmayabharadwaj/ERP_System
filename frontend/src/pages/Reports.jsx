import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  Building2,
  Printer,
  RefreshCw,
  Percent,
  School,
  BarChart3,
} from 'lucide-react'
import { Card, CardTitle, GlassCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dashboardService from '@/lib/dashboard'
import studentsService from '@/lib/students'
import admissionsService from '@/lib/admissions'
import feesService from '@/lib/fees'
import paymentsService from '@/lib/payments'
import hostelService from '@/lib/hostel'

const monthLabel = (month, year) => new Date(year || new Date().getFullYear(), (month || 1) - 1, 1).toLocaleString('en-US', { month: 'short' })

const fallbackData = {
  enrollmentTrend: [],
  enrollmentByIntake: [],
  feeCollectionData: [],
  paymentMethodDistribution: [],
  hostelOccupancy: [],
  roomStatusData: [],
  academicTrend: [],
  academicByCourse: [],
  metrics: {
    enrollment: [
      { label: 'Total Students', value: '0', delta: 'No data', icon: Users, iconColor: 'text-blue-400' },
      { label: 'New Admissions', value: '0', delta: 'No data', icon: TrendingUp, iconColor: 'text-emerald-400' },
      { label: 'Admission Yield', value: '0%', delta: 'No data', icon: Percent, iconColor: 'text-violet-400' },
      { label: 'Courses Covered', value: '0', delta: 'No data', icon: School, iconColor: 'text-amber-400' },
    ],
    financial: [
      { label: 'Collected (Period)', value: '₹0', delta: 'No data', icon: CreditCard, iconColor: 'text-emerald-400' },
      { label: 'Pending Dues', value: '₹0', delta: 'No data', icon: TrendingUp, iconColor: 'text-amber-400' },
      { label: 'Collection Rate', value: '0%', delta: 'No data', icon: Percent, iconColor: 'text-blue-400' },
      { label: 'Payment Methods', value: '0', delta: 'No data', icon: BarChart3, iconColor: 'text-violet-400' },
    ],
    hostel: [
      { label: 'Total Capacity', value: '0', delta: 'No data', icon: Building2, iconColor: 'text-blue-400' },
      { label: 'Occupied Beds', value: '0', delta: 'No data', icon: Users, iconColor: 'text-emerald-400' },
      { label: 'Occupancy Rate', value: '0%', delta: 'No data', icon: Percent, iconColor: 'text-violet-400' },
      { label: 'Maintenance Rooms', value: '0', delta: 'No data', icon: TrendingUp, iconColor: 'text-amber-400' },
    ],
    academic: [
      { label: 'Active Students', value: '0', delta: 'No data', icon: School, iconColor: 'text-blue-400' },
      { label: 'Graduated', value: '0', delta: 'No data', icon: Percent, iconColor: 'text-emerald-400' },
      { label: 'Semester Buckets', value: '0', delta: 'No data', icon: TrendingUp, iconColor: 'text-violet-400' },
      { label: 'Course Buckets', value: '0', delta: 'No data', icon: FileBarChart, iconColor: 'text-amber-400' },
    ],
  },
}

const reportTypes = [
  { id: 'enrollment', name: 'Enrollment Report', icon: Users, description: 'Student enrollment statistics and trends' },
  { id: 'financial', name: 'Financial Report', icon: CreditCard, description: 'Fee collection and payment analysis' },
  { id: 'hostel', name: 'Hostel Report', icon: Building2, description: 'Room occupancy and allocation report' },
  { id: 'academic', name: 'Academic Report', icon: FileBarChart, description: 'Semester and course-wise student analytics' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month')
  const [selectedReport, setSelectedReport] = useState('enrollment')
  const [reportData, setReportData] = useState(fallbackData)
  const [isLoading, setIsLoading] = useState(true)

  const selectedReportMeta = useMemo(
    () => reportTypes.find((report) => report.id === selectedReport),
    [selectedReport]
  )

  const selectedMetrics = reportData.metrics[selectedReport] || []

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const [
        enrollmentTrends,
        feeTrends,
        studentsStats,
        admissionsStats,
        feesStats,
        paymentsStats,
        hostelStats,
        studentsListResponse,
        admissionsListResponse,
      ] = await Promise.all([
        dashboardService.getEnrollmentTrends(),
        dashboardService.getFeeTrends(),
        studentsService.getStats(),
        admissionsService.getStats(),
        feesService.getStats(),
        paymentsService.getStats(),
        hostelService.getStats(),
        studentsService.getAll({ limit: 2000 }),
        admissionsService.getAll({ limit: 2000 }),
      ])

      const studentsList = studentsListResponse?.students || []
      const admissionsList = admissionsListResponse?.admissions || []

      const normalizedEnrollmentTrend = (enrollmentTrends || []).map((item) => ({
        month: monthLabel(item?._id?.month, item?._id?.year),
        students: item?.count || 0,
      }))

      const intakeMap = admissionsList.reduce((accumulator, admission) => {
        const intakeYear = String(admission?.academicInfo?.appliedYear || new Date(admission?.createdAt || Date.now()).getFullYear())
        if (!accumulator[intakeYear]) {
          accumulator[intakeYear] = { intake: intakeYear, admitted: 0, joined: 0 }
        }
        accumulator[intakeYear].admitted += 1
        if (admission?.convertedToStudent) {
          accumulator[intakeYear].joined += 1
        }
        return accumulator
      }, {})

      const normalizedEnrollmentByIntake = Object.values(intakeMap).sort((a, b) => Number(a.intake) - Number(b.intake))

      const normalizedFeeCollection = (feeTrends || []).map((item) => ({
        month: monthLabel(item?._id?.month, item?._id?.year),
        collected: item?.total || 0,
        pending: Math.max(0, (feesStats?.summary?.pendingAmount || 0) / Math.max(1, (feeTrends || []).length)),
      }))

      const totalMethodCount = (paymentsStats?.methodDistribution || []).reduce((sum, item) => sum + (item?.count || 0), 0)
      const methodColorMap = {
        cash: '#f59e0b',
        card: '#3b82f6',
        upi: '#10b981',
        netbanking: '#8b5cf6',
        cheque: '#ef4444',
        dd: '#06b6d4',
      }

      const normalizedPaymentMethodDistribution = (paymentsStats?.methodDistribution || []).map((item) => ({
        name: item?._id || 'unknown',
        value: totalMethodCount > 0 ? Number((((item?.count || 0) * 100) / totalMethodCount).toFixed(1)) : 0,
        rawCount: item?.count || 0,
        color: methodColorMap[item?._id] || '#6366f1',
      }))

      const normalizedHostelOccupancy = (hostelStats?.blockWiseStats || []).map((block) => ({
        block: `Block ${block?._id || '-'}`,
        total: block?.totalCapacity || 0,
        occupied: block?.currentOccupancy || 0,
      }))

      const normalizedRoomStatusData = [
        { name: 'Occupied', value: hostelStats?.occupiedRooms || 0, color: '#3b82f6' },
        { name: 'Available', value: hostelStats?.availableRooms || 0, color: '#10b981' },
        { name: 'Maintenance', value: hostelStats?.maintenanceRooms || 0, color: '#f59e0b' },
      ]

      const semesterMap = studentsList.reduce((accumulator, student) => {
        const semester = Number(student?.academicInfo?.semester || 0)
        if (!semester) {
          return accumulator
        }

        if (!accumulator[semester]) {
          accumulator[semester] = { term: `Sem ${semester}`, totalStudents: 0, activeStudents: 0 }
        }

        accumulator[semester].totalStudents += 1
        if (student?.academicInfo?.status === 'active') {
          accumulator[semester].activeStudents += 1
        }

        return accumulator
      }, {})

      const normalizedAcademicTrend = Object.values(semesterMap)
        .sort((a, b) => Number(a.term.replace('Sem ', '')) - Number(b.term.replace('Sem ', '')))
        .map((item) => ({
          ...item,
          activeRate: item.totalStudents > 0 ? Number(((item.activeStudents / item.totalStudents) * 100).toFixed(1)) : 0,
        }))

      const courseMap = studentsList.reduce((accumulator, student) => {
        const course = student?.academicInfo?.course || 'Unknown'
        if (!accumulator[course]) {
          accumulator[course] = { course, total: 0, active: 0 }
        }

        accumulator[course].total += 1
        if (student?.academicInfo?.status === 'active') {
          accumulator[course].active += 1
        }

        return accumulator
      }, {})

      const normalizedAcademicByCourse = Object.values(courseMap)
        .sort((a, b) => b.total - a.total)
        .map((item) => ({
          course: item.course,
          activeRate: item.total > 0 ? Number(((item.active / item.total) * 100).toFixed(1)) : 0,
        }))

      const joinedCount = normalizedEnrollmentByIntake.reduce((sum, row) => sum + row.joined, 0)
      const admittedCount = normalizedEnrollmentByIntake.reduce((sum, row) => sum + row.admitted, 0)
      const enrollmentYield = admittedCount > 0 ? ((joinedCount / admittedCount) * 100).toFixed(1) : '0.0'

      const totalAmount = feesStats?.summary?.totalAmount || 0
      const collectedAmount = feesStats?.summary?.collectedAmount || 0
      const collectionRate = totalAmount > 0 ? ((collectedAmount / totalAmount) * 100).toFixed(1) : '0.0'

      const totalCapacity = hostelStats?.occupancy?.totalCapacity || 0
      const currentOccupancy = hostelStats?.occupancy?.currentOccupancy || 0
      const occupancyRate = totalCapacity > 0 ? ((currentOccupancy / totalCapacity) * 100).toFixed(1) : '0.0'

      const metrics = {
        enrollment: [
          { label: 'Total Students', value: String(studentsStats?.total || 0), delta: `${studentsStats?.active || 0} active`, icon: Users, iconColor: 'text-blue-400' },
          { label: 'New Admissions', value: String(admissionsStats?.total || 0), delta: `${admissionsStats?.pending || 0} pending`, icon: TrendingUp, iconColor: 'text-emerald-400' },
          { label: 'Admission Yield', value: `${enrollmentYield}%`, delta: `${joinedCount} joined / ${admittedCount} admitted`, icon: Percent, iconColor: 'text-violet-400' },
          { label: 'Courses Covered', value: String((studentsStats?.courseDistribution || []).length), delta: 'From enrolled students', icon: School, iconColor: 'text-amber-400' },
        ],
        financial: [
          { label: 'Collected (Total)', value: formatCurrency(collectedAmount), delta: `${paymentsStats?.monthlyCollection ? formatCurrency(paymentsStats.monthlyCollection) : formatCurrency(0)} this month`, icon: CreditCard, iconColor: 'text-emerald-400' },
          { label: 'Pending Dues', value: formatCurrency(feesStats?.summary?.pendingAmount || 0), delta: 'Across all fee records', icon: TrendingUp, iconColor: 'text-amber-400' },
          { label: 'Collection Rate', value: `${collectionRate}%`, delta: 'Collected / Billable', icon: Percent, iconColor: 'text-blue-400' },
          { label: 'Payment Methods', value: String((paymentsStats?.methodDistribution || []).length), delta: 'Active transaction channels', icon: BarChart3, iconColor: 'text-violet-400' },
        ],
        hostel: [
          { label: 'Total Capacity', value: String(totalCapacity), delta: `${hostelStats?.totalRooms || 0} rooms`, icon: Building2, iconColor: 'text-blue-400' },
          { label: 'Occupied Beds', value: String(currentOccupancy), delta: 'Current residents', icon: Users, iconColor: 'text-emerald-400' },
          { label: 'Occupancy Rate', value: `${occupancyRate}%`, delta: `${currentOccupancy}/${totalCapacity} beds`, icon: Percent, iconColor: 'text-violet-400' },
          { label: 'Maintenance Rooms', value: String(hostelStats?.maintenanceRooms || 0), delta: 'Unavailable for allocation', icon: TrendingUp, iconColor: 'text-amber-400' },
        ],
        academic: [
          { label: 'Active Students', value: String(studentsStats?.active || 0), delta: `of ${studentsStats?.total || 0} total`, icon: School, iconColor: 'text-blue-400' },
          { label: 'Graduated', value: String(studentsStats?.graduated || 0), delta: 'From student records', icon: Percent, iconColor: 'text-emerald-400' },
          { label: 'Semester Buckets', value: String(normalizedAcademicTrend.length), delta: 'Semesters with enrollments', icon: TrendingUp, iconColor: 'text-violet-400' },
          { label: 'Course Buckets', value: String(normalizedAcademicByCourse.length), delta: 'Courses in student data', icon: FileBarChart, iconColor: 'text-amber-400' },
        ],
      }

      setReportData({
        enrollmentTrend: normalizedEnrollmentTrend,
        enrollmentByIntake: normalizedEnrollmentByIntake,
        feeCollectionData: normalizedFeeCollection,
        paymentMethodDistribution: normalizedPaymentMethodDistribution,
        hostelOccupancy: normalizedHostelOccupancy,
        roomStatusData: normalizedRoomStatusData,
        academicTrend: normalizedAcademicTrend,
        academicByCourse: normalizedAcademicByCourse,
        metrics,
      })
    } catch (error) {
      setReportData(fallbackData)
      toast.error(error?.message || 'Unable to fetch reports from backend')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleExportReport = (type) => {
    const reportName = reportTypes.find((report) => report.id === type)?.name || type
    const metricRows = (reportData.metrics[type] || []).map((metric) => `${metric.label}: ${metric.value} (${metric.delta})`)
    const blob = new Blob([
      `ERP Report\nType: ${reportName}\nRange: ${dateRange}\nGenerated: ${new Date().toISOString()}\n\n${metricRows.join('\n')}`,
    ], { type: 'text/plain;charset=utf-8;' })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${type}-report.txt`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success(`${reportName} exported`)
  }

  const handlePrintReport = (type) => {
    setSelectedReport(type)
    window.print()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and analyze institution reports from live backend data</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadReports} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <GlassCard key={metric.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{metric.delta}</p>
                </div>
                <Icon className={cn('w-8 h-8', metric.iconColor)} />
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.id}
                className={cn(
                  'p-5 cursor-pointer transition-all hover:border-primary/50',
                  selectedReport === report.id && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{report.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePrintReport(report.id)}>
                    <Printer className="w-3 h-3 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExportReport(report.id)}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-4 border-primary/30 bg-primary/5">
          <p className="text-sm font-medium">Active Report: {selectedReportMeta?.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{selectedReportMeta?.description}</p>
        </Card>
      </motion.div>

      {selectedReport === 'enrollment' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Enrollment Trend (Monthly)</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.enrollmentTrend}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} />
                    <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Admissions vs Converted Students (by Intake)</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.enrollmentByIntake}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="intake" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} />
                    <Legend />
                    <Bar dataKey="admitted" name="Admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="joined" name="Converted to Students" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {selectedReport === 'financial' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Fee Collection Trend</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value / 100000}L`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} formatter={(value) => [formatCurrency(value), '']} />
                    <Legend />
                    <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending (distributed)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Payment Method Distribution</CardTitle>
              <div className="h-[300px] flex">
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie data={reportData.paymentMethodDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {reportData.paymentMethodDistribution.map((entry, index) => (
                        <Cell key={`financial-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  {reportData.paymentMethodDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground capitalize">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {selectedReport === 'hostel' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Hostel Occupancy by Block</CardTitle>
              <div className="space-y-4">
                {reportData.hostelOccupancy.map((block) => {
                  const percentage = block.total > 0 ? Math.round((block.occupied / block.total) * 100) : 0
                  return (
                    <div key={block.block}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">{block.block}</span>
                        <span className="text-muted-foreground">{block.occupied}/{block.total} beds</span>
                      </div>
                      <div className="relative">
                        <Progress value={percentage} className="h-3" />
                        <span className="absolute right-0 -top-6 text-xs font-medium">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Room Status Distribution</CardTitle>
              <div className="h-[300px] flex">
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie data={reportData.roomStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {reportData.roomStatusData.map((entry, index) => (
                        <Cell key={`hostel-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  {reportData.roomStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {selectedReport === 'academic' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Semester-wise Active vs Total Students</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.academicTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="term" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} />
                    <Legend />
                    <Line type="monotone" dataKey="totalStudents" name="Total Students" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="activeStudents" name="Active Students" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Course-wise Active Student Rate</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.academicByCourse}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="course" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '0.75rem' }} formatter={(value) => [`${value}%`, 'Active Rate']} />
                    <Bar dataKey="activeRate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
