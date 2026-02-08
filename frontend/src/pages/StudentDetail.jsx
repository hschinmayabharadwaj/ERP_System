import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  CreditCard,
  Building2,
  FileText,
  Edit,
  Download,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatCurrency, formatDate, getInitials, getStatusColor } from '@/lib/utils'

// Mock student data
const studentData = {
  id: 'STU001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  dateOfBirth: '2002-05-15',
  course: 'B.Tech Computer Science',
  semester: 6,
  status: 'active',
  enrollmentDate: '2022-08-15',
  address: {
    street: '123 Main Street',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001'
  },
  guardian: {
    name: 'Suresh Sharma',
    relation: 'Father',
    phone: '+91 98765 12345'
  },
  fees: {
    total: 450000,
    paid: 350000,
    pending: 100000,
    nextDue: '2026-03-15'
  },
  hostel: {
    allocated: true,
    roomNumber: '204',
    block: 'A',
    monthlyFee: 8000
  },
  attendance: 85,
  cgpa: 8.4
}

const feeHistory = [
  { id: 1, date: '2025-08-15', amount: 150000, type: 'Tuition Fee', status: 'paid', receipt: 'RCP001' },
  { id: 2, date: '2025-12-10', amount: 100000, type: 'Tuition Fee', status: 'paid', receipt: 'RCP002' },
  { id: 3, date: '2026-02-01', amount: 100000, type: 'Tuition Fee', status: 'paid', receipt: 'RCP003' },
  { id: 4, date: '2026-03-15', amount: 100000, type: 'Tuition Fee', status: 'pending', receipt: null },
]

const documents = [
  { id: 1, name: 'Admission Form', type: 'PDF', uploadDate: '2022-08-10' },
  { id: 2, name: 'ID Proof', type: 'PDF', uploadDate: '2022-08-10' },
  { id: 3, name: 'Marksheet - Semester 5', type: 'PDF', uploadDate: '2025-12-20' },
]

export default function StudentDetail() {
  const { id } = useParams()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/students" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Student Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl">{getInitials(studentData.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{studentData.name}</h2>
                <p className="text-muted-foreground">{studentData.course}</p>
                <Badge className={cn("mt-2", getStatusColor(studentData.status))}>
                  {studentData.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Student ID</div>
                <div className="font-mono font-bold">{studentData.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {studentData.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {studentData.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {studentData.address.city}, {studentData.address.state}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">CGPA</div>
              <div className="text-xl font-bold">{studentData.cgpa}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Attendance</div>
              <div className="text-xl font-bold">{studentData.attendance}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Fee Pending</div>
              <div className="text-xl font-bold">{formatCurrency(studentData.fees.pending)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hostel Room</div>
              <div className="text-xl font-bold">{studentData.hostel.block}-{studentData.hostel.roomNumber}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="hostel">Hostel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card className="p-6">
              <CardTitle className="text-lg mb-4">Personal Information</CardTitle>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span>{formatDate(studentData.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrollment Date</span>
                  <span>{formatDate(studentData.enrollmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Semester</span>
                  <span>Semester {studentData.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guardian</span>
                  <span>{studentData.guardian.name} ({studentData.guardian.relation})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guardian Phone</span>
                  <span>{studentData.guardian.phone}</span>
                </div>
              </div>
            </Card>

            {/* Fee Overview */}
            <Card className="p-6">
              <CardTitle className="text-lg mb-4">Fee Overview</CardTitle>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Payment Progress</span>
                    <span>{Math.round((studentData.fees.paid / studentData.fees.total) * 100)}%</span>
                  </div>
                  <Progress value={(studentData.fees.paid / studentData.fees.total) * 100} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Fees</span>
                  <span className="font-medium">{formatCurrency(studentData.fees.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(studentData.fees.paid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Amount</span>
                  <span className="text-amber-400 font-medium">{formatCurrency(studentData.fees.pending)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Due Date</span>
                  <span>{formatDate(studentData.fees.nextDue)}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeHistory.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{formatDate(fee.date)}</TableCell>
                    <TableCell>{fee.type}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(fee.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(fee.status)}>{fee.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {fee.receipt ? (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          {fee.receipt}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(doc.uploadDate)}</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hostel">
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Room Details</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block</span>
                  <span className="font-medium">Block {studentData.hostel.block}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room Number</span>
                  <span className="font-medium">{studentData.hostel.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Fee</span>
                  <span className="font-medium">{formatCurrency(studentData.hostel.monthlyFee)}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
