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
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, formatCurrency, getInitials } from '@/lib/utils'
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

const stats = [
  { 
    title: 'Total Students', 
    value: '2,847', 
    change: '+12.5%', 
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    title: 'New Admissions', 
    value: '156', 
    change: '+8.2%', 
    trend: 'up',
    icon: GraduationCap,
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    title: 'Fee Collection', 
    value: '₹24.5L', 
    change: '+15.3%', 
    trend: 'up',
    icon: CreditCard,
    color: 'from-violet-500 to-violet-600'
  },
  { 
    title: 'Hostel Occupancy', 
    value: '94%', 
    change: '-2.1%', 
    trend: 'down',
    icon: Building2,
    color: 'from-amber-500 to-amber-600'
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
    color: 'text-emerald-400'
  },
  { 
    id: 2, 
    type: 'payment', 
    title: 'Fee payment received', 
    description: '₹45,000 from Priya Patel',
    time: '15 min ago',
    icon: CreditCard,
    color: 'text-blue-400'
  },
  { 
    id: 3, 
    type: 'hostel', 
    title: 'Room allocated', 
    description: 'Room 204 to Amit Kumar',
    time: '1 hour ago',
    icon: Building2,
    color: 'text-violet-400'
  },
  { 
    id: 4, 
    type: 'alert', 
    title: 'Payment overdue', 
    description: 'Suresh - ₹25,000 pending',
    time: '2 hours ago',
    icon: AlertCircle,
    color: 'text-amber-400'
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
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <GlassCard className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                      )}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    stat.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
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

        {/* Admission Distribution */}
        <motion.div variants={itemVariants}>
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
      </div>

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
              {recentActivities.map((activity) => {
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
