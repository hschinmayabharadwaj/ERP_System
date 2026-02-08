import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  Building2,
  FileText,
  Printer,
  Mail,
  RefreshCw,
  ChevronDown,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatCurrency } from '@/lib/utils'
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
  ResponsiveContainer
} from 'recharts'

// Mock data
const enrollmentTrend = [
  { month: 'Sep', students: 2400 },
  { month: 'Oct', students: 2520 },
  { month: 'Nov', students: 2650 },
  { month: 'Dec', students: 2700 },
  { month: 'Jan', students: 2780 },
  { month: 'Feb', students: 2847 },
]

const feeCollectionData = [
  { month: 'Sep', collected: 2400000, pending: 600000 },
  { month: 'Oct', collected: 2800000, pending: 400000 },
  { month: 'Nov', collected: 3200000, pending: 350000 },
  { month: 'Dec', collected: 2900000, pending: 500000 },
  { month: 'Jan', collected: 3500000, pending: 300000 },
  { month: 'Feb', collected: 2450000, pending: 800000 },
]

const courseDistribution = [
  { name: 'B.Tech', value: 1200, color: '#3b82f6' },
  { name: 'M.Sc', value: 450, color: '#10b981' },
  { name: 'MBA', value: 380, color: '#8b5cf6' },
  { name: 'B.Com', value: 520, color: '#f59e0b' },
  { name: 'Others', value: 297, color: '#6366f1' },
]

const hostelOccupancy = [
  { block: 'Block A', total: 100, occupied: 92 },
  { block: 'Block B', total: 80, occupied: 75 },
  { block: 'Block C', total: 60, occupied: 58 },
  { block: 'Block D', total: 40, occupied: 35 },
]

const reportTypes = [
  { id: 'enrollment', name: 'Enrollment Report', icon: Users, description: 'Student enrollment statistics and trends' },
  { id: 'financial', name: 'Financial Report', icon: CreditCard, description: 'Fee collection and payment analysis' },
  { id: 'hostel', name: 'Hostel Report', icon: Building2, description: 'Room occupancy and allocation report' },
  { id: 'academic', name: 'Academic Report', icon: FileBarChart, description: 'Course-wise performance analytics' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month')
  const [selectedReport, setSelectedReport] = useState('enrollment')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and analyze institution reports</p>
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
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold">2,847</h3>
              <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fee Collected</p>
              <h3 className="text-2xl font-bold">₹24.5L</h3>
              <p className="text-xs text-emerald-400 mt-1">+8% from last month</p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-400" />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hostel Occupancy</p>
              <h3 className="text-2xl font-bold">94%</h3>
              <p className="text-xs text-amber-400 mt-1">260/280 beds</p>
            </div>
            <Building2 className="w-8 h-8 text-violet-400" />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Admissions</p>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-xs text-emerald-400 mt-1">+23% from last year</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Report Types */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <Card 
                key={report.id}
                className={cn(
                  "p-5 cursor-pointer transition-all hover:border-primary/50",
                  selectedReport === report.id && "border-primary bg-primary/5"
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Printer className="w-3 h-3 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <CardTitle className="text-lg mb-6">Enrollment Trend</CardTitle>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrend}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222.2 84% 4.9%)', 
                      border: '1px solid hsl(217.2 32.6% 17.5%)',
                      borderRadius: '0.75rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorStudents)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Course Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <CardTitle className="text-lg mb-6">Students by Course</CardTitle>
            <div className="h-[300px] flex">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222.2 84% 4.9%)', 
                      border: '1px solid hsl(217.2 32.6% 17.5%)',
                      borderRadius: '0.75rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                {courseDistribution.map((item) => (
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

        {/* Fee Collection */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <CardTitle className="text-lg mb-6">Fee Collection Analysis</CardTitle>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222.2 84% 4.9%)', 
                      border: '1px solid hsl(217.2 32.6% 17.5%)',
                      borderRadius: '0.75rem'
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Hostel Occupancy */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <CardTitle className="text-lg mb-6">Hostel Occupancy by Block</CardTitle>
            <div className="space-y-4">
              {hostelOccupancy.map((block) => {
                const percentage = Math.round((block.occupied / block.total) * 100)
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
      </div>
    </motion.div>
  )
}
