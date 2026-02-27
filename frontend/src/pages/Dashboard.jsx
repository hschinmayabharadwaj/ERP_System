import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Building2, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Award,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, formatCurrency, getInitials } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Animated stat card component
const StatCard = ({ stat, index }) => {
  const Icon = stat.icon
  const isPositive = stat.trend === 'up'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br backdrop-blur-xl",
        `${stat.color} bg-opacity-10`,
        "border border-white/20",
        "hover:border-white/40 transition-all duration-300"
      )}>
        {/* Animated gradient orb */}
        <motion.div
          className={cn(
            "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl",
            `${stat.color.split(' ')[1]}`
          )}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ opacity: 0.1 }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl backdrop-blur-sm",
              `${stat.color} bg-opacity-20`
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <Badge 
              className={cn(
                "gap-1",
                isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              )}
            >
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change}
            </Badge>
          </div>
          
          <p className="text-sm text-white/60 mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
      </div>
    </motion.div>
  )
}

const stats = [
  { 
    title: 'Total Students', 
    value: '2,847', 
    change: '+12.5%', 
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    roles: ['admin', 'staff']
  },
  { 
    title: 'New Admissions', 
    value: '156', 
    change: '+8.2%', 
    trend: 'up',
    icon: GraduationCap,
    color: 'from-emerald-500 to-emerald-600',
    roles: ['admin', 'staff']
  },
  { 
    title: 'Fee Collection', 
    value: '₹24.5L', 
    change: '+15.3%', 
    trend: 'up',
    icon: CreditCard,
    color: 'from-violet-500 to-violet-600',
    roles: ['admin', 'accountant']
  },
  { 
    title: 'Hostel Occupancy', 
    value: '94%', 
    change: '-2.1%', 
    trend: 'down',
    icon: Building2,
    color: 'from-amber-500 to-amber-600',
    roles: ['admin', 'hostel_warden']
  },
  {
    title: 'Pending Payments',
    value: '₹8.2L',
    change: '-5.4%',
    trend: 'down',
    icon: AlertCircle,
    color: 'from-red-500 to-red-600',
    roles: ['accountant']
  },
  {
    title: 'Available Rooms',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: Building2,
    color: 'from-teal-500 to-teal-600',
    roles: ['hostel_warden']
  },
]

const revenueData = [
  { month: 'Jan', revenue: 186000, expenses: 120000 },
  { month: 'Feb', revenue: 205000, expenses: 145000 },
  { month: 'Mar', revenue: 237000, expenses: 160000 },
  { month: 'Apr', revenue: 273000, expenses: 175000 },
  { month: 'May', revenue: 209000, expenses: 155000 },
  { month: 'Jun', revenue: 214000, expenses: 170000 },
  { month: 'Jul', revenue: 252000, expenses: 185000 },
]

const admissionData = [
  { name: 'Engineering', value: 45, color: '#3b82f6' },
  { name: 'Science', value: 25, color: '#10b981' },
  { name: 'Commerce', value: 20, color: '#8b5cf6' },
  { name: 'Arts', value: 10, color: '#f59e0b' },
]

const recentActivities = [
  { 
    id: 1, 
    type: 'admission', 
    title: 'New admission approved', 
    description: 'Rahul Sharma - B.Tech CSE',
    time: '2 min ago',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    roles: ['admin', 'staff']
  },
  { 
    id: 2, 
    type: 'payment', 
    title: 'Fee payment received', 
    description: '₹45,000 from Priya Patel',
    time: '15 min ago',
    icon: CreditCard,
    color: 'text-blue-400',
    roles: ['admin', 'accountant']
  },
  { 
    id: 3, 
    type: 'hostel', 
    title: 'Room allocated', 
    description: 'Room 204 to Amit Kumar',
    time: '1 hour ago',
    icon: Building2,
    color: 'text-violet-400',
    roles: ['admin', 'hostel_warden']
  },
  { 
    id: 4, 
    type: 'alert', 
    title: 'Payment overdue', 
    description: 'Suresh - ₹25,000 pending',
    time: '2 hours ago',
    icon: AlertCircle,
    color: 'text-amber-400',
    roles: ['admin', 'accountant']
  },
  {
    id: 5,
    type: 'hostel',
    title: 'Maintenance request',
    description: 'Room 312 - plumbing issue',
    time: '3 hours ago',
    icon: Building2,
    color: 'text-orange-400',
    roles: ['admin', 'hostel_warden']
  },
  {
    id: 6,
    type: 'admission',
    title: 'Student enrolled',
    description: 'Meera Iyer - M.Sc Physics',
    time: '4 hours ago',
    icon: GraduationCap,
    color: 'text-cyan-400',
    roles: ['admin', 'staff']
  },
]

const upcomingEvents = [
  { id: 1, title: 'Fee deadline', date: 'Feb 15', type: 'deadline' },
  { id: 2, title: 'Admission drive', date: 'Feb 20', type: 'event' },
  { id: 3, title: 'Hostel inspection', date: 'Feb 25', type: 'meeting' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const { user } = useAuth()
  const userRole = user?.role || 'staff'

  const filteredStats = stats.filter(s => s.roles.includes(userRole))
  const filteredActivities = recentActivities.filter(a => a.roles.includes(userRole))

  const showFinanceCharts = ['admin', 'accountant'].includes(userRole)
  const showAdmissionChart = ['admin', 'staff'].includes(userRole)
  const showHostelSection = ['admin', 'hostel_warden'].includes(userRole)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Role badge */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Badge className="capitalize text-xs px-3 py-1 bg-primary/20 text-primary border-primary/30">
          {userRole.replace('_', ' ')}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Welcome back, {user?.firstName || user?.name || 'User'}
        </span>
      </motion.div>

      {/* Stats Grid */}
      <div className={cn(
        "grid gap-6",
        filteredStats.length <= 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {filteredStats.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      {(showFinanceCharts || showAdmissionChart) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart — admin & accountant */}
          {showFinanceCharts && (
            <motion.div variants={itemVariants} className={showAdmissionChart ? "lg:col-span-2" : "lg:col-span-3"}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Monthly revenue vs expenses</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/1000}K`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222.2 84% 4.9%)', 
                          border: '1px solid hsl(217.2 32.6% 17.5%)',
                          borderRadius: '0.75rem'
                        }}
                        formatter={(value) => [formatCurrency(value), '']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                        name="Revenue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorExpenses)" 
                        strokeWidth={2}
                        name="Expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Admission Distribution — admin & staff */}
          {showAdmissionChart && (
            <motion.div variants={itemVariants} className={showFinanceCharts ? "" : "lg:col-span-3"}>
              <Card className="p-6 h-full">
                <CardTitle className="mb-6">Admissions by Course</CardTitle>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={admissionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {admissionData.map((entry, index) => (
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
                </div>
                <div className="mt-4 space-y-2">
                  {admissionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Hostel Overview — admin & warden */}
      {showHostelSection && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <CardTitle>Hostel Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Block-wise occupancy</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { block: 'Block A', type: 'Boys', occupancy: 92, total: 40, filled: 37, color: '#3b82f6' },
                { block: 'Block B', type: 'Boys', occupancy: 87, total: 30, filled: 26, color: '#10b981' },
                { block: 'Block C', type: 'Girls', occupancy: 97, total: 35, filled: 34, color: '#8b5cf6' },
                { block: 'Block D', type: 'Girls', occupancy: 90, total: 20, filled: 18, color: '#f59e0b' },
              ].map((b) => (
                <div key={b.block} className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{b.block}</span>
                    <Badge variant="secondary" className="text-xs">{b.type}</Badge>
                  </div>
                  <div className="text-2xl font-bold">{b.occupancy}%</div>
                  <Progress value={b.occupancy} className="h-2" />
                  <p className="text-xs text-muted-foreground">{b.filled}/{b.total} rooms filled</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={cn("p-2 rounded-lg bg-muted", activity.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="ghost" size="icon">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">Feb</span>
                    <span className="text-lg font-bold text-primary">{event.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
