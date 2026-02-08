import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Receipt,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatCurrency, formatDate, getInitials, getStatusColor } from '@/lib/utils'

// Mock fee data
const feeRecords = [
  {
    id: 'FEE001',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    course: 'B.Tech CSE',
    totalAmount: 450000,
    paidAmount: 350000,
    pendingAmount: 100000,
    dueDate: '2026-03-15',
    status: 'partial',
    lastPayment: '2026-02-01'
  },
  {
    id: 'FEE002',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    course: 'B.Com',
    totalAmount: 180000,
    paidAmount: 180000,
    pendingAmount: 0,
    dueDate: '2026-02-28',
    status: 'paid',
    lastPayment: '2026-02-05'
  },
  {
    id: 'FEE003',
    studentId: 'STU003',
    studentName: 'Amit Kumar',
    course: 'M.Sc Physics',
    totalAmount: 220000,
    paidAmount: 0,
    pendingAmount: 220000,
    dueDate: '2026-02-10',
    status: 'overdue',
    lastPayment: null
  },
  {
    id: 'FEE004',
    studentId: 'STU004',
    studentName: 'Sneha Gupta',
    course: 'B.Tech ECE',
    totalAmount: 450000,
    paidAmount: 450000,
    pendingAmount: 0,
    dueDate: '2026-01-31',
    status: 'paid',
    lastPayment: '2026-01-28'
  },
  {
    id: 'FEE005',
    studentId: 'STU005',
    studentName: 'Vikram Singh',
    course: 'MBA',
    totalAmount: 500000,
    paidAmount: 250000,
    pendingAmount: 250000,
    dueDate: '2026-03-20',
    status: 'partial',
    lastPayment: '2026-01-15'
  },
]

const feeStructure = [
  { course: 'B.Tech CSE', tuition: 400000, hostel: 96000, lab: 20000, library: 5000, exam: 10000 },
  { course: 'B.Tech ECE', tuition: 400000, hostel: 96000, lab: 20000, library: 5000, exam: 10000 },
  { course: 'M.Sc Physics', tuition: 180000, hostel: 72000, lab: 15000, library: 5000, exam: 8000 },
  { course: 'MBA', tuition: 450000, hostel: 96000, lab: 10000, library: 5000, exam: 12000 },
  { course: 'B.Com', tuition: 150000, hostel: 72000, lab: 0, library: 5000, exam: 8000 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Fees() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalCollected: feeRecords.reduce((sum, r) => sum + r.paidAmount, 0),
    totalPending: feeRecords.reduce((sum, r) => sum + r.pendingAmount, 0),
    paidCount: feeRecords.filter(r => r.status === 'paid').length,
    overdueCount: feeRecords.filter(r => r.status === 'overdue').length,
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground">Track and manage student fee collection</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalCollected)}</h3>
              <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                <ArrowUpRight className="w-4 h-4" />
                +12.5% from last month
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pending</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalPending)}</h3>
              <div className="text-amber-400 text-sm mt-1">
                Across {feeRecords.filter(r => r.pendingAmount > 0).length} students
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fully Paid</p>
              <h3 className="text-2xl font-bold mt-1">{stats.paidCount}</h3>
              <div className="text-muted-foreground text-sm mt-1">Students this semester</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h3 className="text-2xl font-bold mt-1 text-rose-400">{stats.overdueCount}</h3>
              <div className="text-rose-400 text-sm mt-1">Requires attention</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Fee Records</TabsTrigger>
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            </div>
          </motion.div>

          {/* Records Table */}
          <motion.div variants={itemVariants}>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{getInitials(record.studentName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.studentName}</div>
                            <div className="text-xs text-muted-foreground">{record.studentId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.course}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.totalAmount)}</TableCell>
                      <TableCell className="text-emerald-400">{formatCurrency(record.paidAmount)}</TableCell>
                      <TableCell className={record.pendingAmount > 0 ? "text-amber-400" : ""}>
                        {formatCurrency(record.pendingAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(record.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Receipt className="w-4 h-4" />
                          </Button>
                          {record.pendingAmount > 0 && (
                            <Button variant="default" size="sm">
                              <CreditCard className="w-4 h-4 mr-1" />
                              Pay
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure by Course</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Tuition Fee</TableHead>
                      <TableHead>Hostel Fee</TableHead>
                      <TableHead>Lab Fee</TableHead>
                      <TableHead>Library Fee</TableHead>
                      <TableHead>Exam Fee</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((fee) => {
                      const total = fee.tuition + fee.hostel + fee.lab + fee.library + fee.exam
                      return (
                        <TableRow key={fee.course}>
                          <TableCell className="font-medium">{fee.course}</TableCell>
                          <TableCell>{formatCurrency(fee.tuition)}</TableCell>
                          <TableCell>{formatCurrency(fee.hostel)}</TableCell>
                          <TableCell>{fee.lab > 0 ? formatCurrency(fee.lab) : '-'}</TableCell>
                          <TableCell>{formatCurrency(fee.library)}</TableCell>
                          <TableCell>{formatCurrency(fee.exam)}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(total)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
