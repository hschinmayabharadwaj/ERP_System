import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ChevronDown,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn, formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

// Mock admission applications
const initialApplications = [
  {
    id: 'APP001',
    name: 'Arun Kumar',
    email: 'arun.kumar@email.com',
    phone: '+91 98765 11111',
    course: 'B.Tech CSE',
    appliedDate: '2026-02-01',
    status: 'pending',
    documents: ['ID Proof', '10th Marksheet', '12th Marksheet'],
    score: 85
  },
  {
    id: 'APP002',
    name: 'Meera Reddy',
    email: 'meera.reddy@email.com',
    phone: '+91 98765 22222',
    course: 'M.Sc Physics',
    appliedDate: '2026-02-03',
    status: 'reviewing',
    documents: ['ID Proof', 'Degree Certificate', 'Experience Letter'],
    score: 78
  },
  {
    id: 'APP003',
    name: 'Karthik Nair',
    email: 'karthik.nair@email.com',
    phone: '+91 98765 33333',
    course: 'MBA',
    appliedDate: '2026-02-05',
    status: 'approved',
    documents: ['ID Proof', 'Degree Certificate', 'Work Experience'],
    score: 92
  },
  {
    id: 'APP004',
    name: 'Divya Sharma',
    email: 'divya.sharma@email.com',
    phone: '+91 98765 44444',
    course: 'B.Com',
    appliedDate: '2026-02-06',
    status: 'rejected',
    documents: ['ID Proof', '10th Marksheet'],
    score: 45
  },
  {
    id: 'APP005',
    name: 'Rohit Singh',
    email: 'rohit.singh@email.com',
    phone: '+91 98765 55555',
    course: 'B.Tech ECE',
    appliedDate: '2026-02-07',
    status: 'pending',
    documents: ['ID Proof', '10th Marksheet', '12th Marksheet', 'JEE Score'],
    score: 88
  },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Eye },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: XCircle },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Admissions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isNewAppOpen, setIsNewAppOpen] = useState(false)
  const [applicationList, setApplicationList] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [newApplication, setNewApplication] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  })

  const handleCreateApplication = () => {
    if (!newApplication.name || !newApplication.email || !newApplication.phone || !newApplication.course) {
      toast.error('Please fill all required application fields')
      return
    }

    const created = {
      id: `APP${String(applicationList.length + 1).padStart(3, '0')}`,
      ...newApplication,
      appliedDate: new Date().toISOString(),
      status: 'pending',
      documents: [],
      score: 0
    }

    setApplicationList((previous) => [created, ...previous])
    setNewApplication({ name: '', email: '', phone: '', course: '' })
    setIsNewAppOpen(false)
    toast.success('Application created successfully')
  }

  const handleApproveApplication = (applicationId) => {
    setApplicationList((previous) => previous.map((application) => (
      application.id === applicationId
        ? { ...application, status: 'approved' }
        : application
    )))
    toast.success('Application approved')
  }

  const filteredApplications = applicationList.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applicationList.length,
    pending: applicationList.filter(a => a.status === 'pending').length,
    approved: applicationList.filter(a => a.status === 'approved').length,
    rejected: applicationList.filter(a => a.status === 'rejected').length,
  }

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
          <h1 className="text-2xl font-bold">Admissions</h1>
          <p className="text-muted-foreground">Manage student admission applications</p>
        </div>
        <Dialog open={isNewAppOpen} onOpenChange={setIsNewAppOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new admission application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter student name"
                  value={newApplication.name}
                  onChange={(event) => setNewApplication((previous) => ({ ...previous, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={newApplication.email}
                  onChange={(event) => setNewApplication((previous) => ({ ...previous, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+91 XXXXX XXXXX"
                  value={newApplication.phone}
                  onChange={(event) => setNewApplication((previous) => ({ ...previous, phone: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={newApplication.course}
                  onValueChange={(value) => setNewApplication((previous) => ({ ...previous, course: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem>
                    <SelectItem value="B.Tech ECE">B.Tech ECE</SelectItem>
                    <SelectItem value="M.Sc Physics">M.Sc Physics</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="B.Com">B.Com</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAppOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateApplication}>Create Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="text-sm text-muted-foreground">Total Applications</div>
          <div className="text-3xl font-bold mt-1">{stats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm text-muted-foreground">Pending Review</div>
          <div className="text-3xl font-bold mt-1 text-amber-400">{stats.pending}</div>
          <Progress value={(stats.pending / stats.total) * 100} className="mt-2 h-1" />
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm text-muted-foreground">Approved</div>
          <div className="text-3xl font-bold mt-1 text-emerald-400">{stats.approved}</div>
          <Progress value={(stats.approved / stats.total) * 100} className="mt-2 h-1" />
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-sm text-muted-foreground">Rejected</div>
          <div className="text-3xl font-bold mt-1 text-rose-400">{stats.rejected}</div>
          <Progress value={(stats.rejected / stats.total) * 100} className="mt-2 h-1" />
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Applications Grid */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplications.map((app) => {
          const StatusIcon = statusConfig[app.status].icon
          return (
            <Card key={app.id} className="p-6 hover:border-primary/50 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{getInitials(app.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.course}</p>
                  </div>
                </div>
                <Badge className={statusConfig[app.status].color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[app.status].label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {app.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {app.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Applied: {formatDate(app.appliedDate)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents</span>
                  <span className="font-medium">{app.documents.length} uploaded</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Score</span>
                  <span className={cn(
                    "font-bold",
                    app.score >= 80 ? "text-emerald-400" : app.score >= 60 ? "text-amber-400" : "text-rose-400"
                  )}>
                    {app.score}%
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedApplication(app)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {app.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApproveApplication(app.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )
        })}
      </motion.div>

      {filteredApplications.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </Card>
      )}

      <Dialog open={Boolean(selectedApplication)} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>{selectedApplication?.id}</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {selectedApplication.name}</p>
              <p><span className="text-muted-foreground">Email:</span> {selectedApplication.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selectedApplication.phone}</p>
              <p><span className="text-muted-foreground">Course:</span> {selectedApplication.course}</p>
              <p><span className="text-muted-foreground">Applied:</span> {formatDate(selectedApplication.appliedDate)}</p>
              <p><span className="text-muted-foreground">Status:</span> {statusConfig[selectedApplication.status].label}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApplication(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
