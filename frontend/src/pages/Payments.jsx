import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Plus,
  Download,
  Receipt,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Printer,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { Card, GlassCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { cn, formatCurrency, formatDate, formatDateTime, getInitials } from '@/lib/utils'

// Mock payments data
const payments = [
  {
    id: 'PAY001',
    receiptNo: 'RCP-2026-001',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    amount: 100000,
    method: 'online',
    date: '2026-02-09T10:30:00',
    status: 'completed',
    transactionId: 'TXN123456789'
  },
  {
    id: 'PAY002',
    receiptNo: 'RCP-2026-002',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    amount: 90000,
    method: 'bank_transfer',
    date: '2026-02-08T15:45:00',
    status: 'completed',
    transactionId: 'NEFT987654321'
  },
  {
    id: 'PAY003',
    receiptNo: 'RCP-2026-003',
    studentId: 'STU005',
    studentName: 'Vikram Singh',
    amount: 125000,
    method: 'cash',
    date: '2026-02-07T11:20:00',
    status: 'completed',
    transactionId: null
  },
  {
    id: 'PAY004',
    receiptNo: 'RCP-2026-004',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    amount: 150000,
    method: 'online',
    date: '2026-01-15T09:00:00',
    status: 'completed',
    transactionId: 'TXN987654321'
  },
  {
    id: 'PAY005',
    receiptNo: 'RCP-2026-005',
    studentId: 'STU005',
    studentName: 'Vikram Singh',
    amount: 125000,
    method: 'cheque',
    date: '2026-01-10T14:30:00',
    status: 'completed',
    transactionId: 'CHQ456789'
  },
]

const paymentMethods = {
  cash: { label: 'Cash', icon: Banknote, color: 'text-emerald-400' },
  online: { label: 'Online', icon: Smartphone, color: 'text-blue-400' },
  bank_transfer: { label: 'Bank Transfer', icon: CreditCard, color: 'text-violet-400' },
  cheque: { label: 'Cheque', icon: Receipt, color: 'text-amber-400' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    return matchesSearch && matchesMethod
  })

  const stats = {
    totalToday: payments.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).reduce((sum, p) => sum + p.amount, 0),
    totalThisMonth: payments.reduce((sum, p) => sum + p.amount, 0),
    transactionCount: payments.length,
    averageAmount: Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length)
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
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track all fee payments and generate receipts</p>
        </div>
        <Dialog open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Enter payment details to record a new fee payment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input placeholder="Enter student ID (e.g., STU001)" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction ID (Optional)</Label>
                <Input placeholder="Enter transaction reference" />
              </div>
              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Input placeholder="Any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPaymentOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsNewPaymentOpen(false)}>Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <p className="text-sm text-muted-foreground">Today's Collection</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalToday || 100000)}</h3>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-muted-foreground">This Month</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalThisMonth)}</h3>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <h3 className="text-2xl font-bold mt-1">{stats.transactionCount}</h3>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-muted-foreground">Average Payment</p>
          <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.averageAmount)}</h3>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search by name, ID or receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="pl-10"
            />
          </div>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </motion.div>

      {/* Payments Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const MethodIcon = paymentMethods[payment.method].icon
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <span className="font-mono text-sm font-medium text-primary">
                        {payment.receiptNo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{getInitials(payment.studentName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-xs text-muted-foreground">{payment.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-400">{formatCurrency(payment.amount)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MethodIcon className={cn("w-4 h-4", paymentMethods[payment.method].color)} />
                        <span>{paymentMethods[payment.method].label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDateTime(payment.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.transactionId ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">{payment.transactionId}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </motion.div>
  )
}
