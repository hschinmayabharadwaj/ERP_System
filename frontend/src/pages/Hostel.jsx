import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Plus,
  Building2,
  Users,
  Bed,
  Key,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Edit,
  MapPin
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatCurrency, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

// Mock room data
const initialRooms = [
  { id: 'R001', number: '101', block: 'A', floor: 1, type: 'single', capacity: 1, occupied: 1, status: 'occupied', fee: 10000, occupants: ['Rahul Sharma'] },
  { id: 'R002', number: '102', block: 'A', floor: 1, type: 'double', capacity: 2, occupied: 2, status: 'occupied', fee: 8000, occupants: ['Priya Patel', 'Sneha Gupta'] },
  { id: 'R003', number: '103', block: 'A', floor: 1, type: 'double', capacity: 2, occupied: 1, status: 'available', fee: 8000, occupants: ['Amit Kumar'] },
  { id: 'R004', number: '104', block: 'A', floor: 1, type: 'triple', capacity: 3, occupied: 0, status: 'available', fee: 6000, occupants: [] },
  { id: 'R005', number: '201', block: 'A', floor: 2, type: 'single', capacity: 1, occupied: 0, status: 'maintenance', fee: 10000, occupants: [] },
  { id: 'R006', number: '202', block: 'A', floor: 2, type: 'double', capacity: 2, occupied: 2, status: 'occupied', fee: 8000, occupants: ['Vikram Singh', 'Karthik Nair'] },
  { id: 'R007', number: '101', block: 'B', floor: 1, type: 'single', capacity: 1, occupied: 1, status: 'occupied', fee: 10000, occupants: ['Divya Sharma'] },
  { id: 'R008', number: '102', block: 'B', floor: 1, type: 'double', capacity: 2, occupied: 0, status: 'available', fee: 8000, occupants: [] },
]

const statusConfig = {
  occupied: { label: 'Occupied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Users },
  available: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  maintenance: { label: 'Maintenance', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Wrench },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Hostel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [blockFilter, setBlockFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [rooms, setRooms] = useState(initialRooms)
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [newRoom, setNewRoom] = useState({ number: '', block: 'A', floor: '1', type: 'single', fee: '' })

  const blockOptions = useMemo(() => [...new Set(rooms.map((room) => room.block))], [rooms])

  const handleCreateRoom = () => {
    if (!newRoom.number || !newRoom.fee) {
      toast.error('Please provide room number and monthly fee')
      return
    }

    const roomTypeCapacity = { single: 1, double: 2, triple: 3 }
    const createdRoom = {
      id: `R${String(rooms.length + 1).padStart(3, '0')}`,
      number: newRoom.number,
      block: newRoom.block,
      floor: Number(newRoom.floor),
      type: newRoom.type,
      capacity: roomTypeCapacity[newRoom.type],
      occupied: 0,
      status: 'available',
      fee: Number(newRoom.fee),
      occupants: []
    }

    setRooms((previous) => [createdRoom, ...previous])
    setNewRoom({ number: '', block: 'A', floor: '1', type: 'single', fee: '' })
    setIsAddRoomOpen(false)
    toast.success(`Room ${createdRoom.block}${createdRoom.number} added`)
  }

  const handleAllocateRoom = (roomId) => {
    setRooms((previous) => previous.map((room) => {
      if (room.id !== roomId) {
        return room
      }
      if (room.occupied >= room.capacity) {
        return room
      }

      const nextOccupantNumber = room.occupied + 1
      const occupantName = `Student ${nextOccupantNumber}`
      const nextOccupied = room.occupied + 1

      return {
        ...room,
        occupied: nextOccupied,
        occupants: [...room.occupants, occupantName],
        status: nextOccupied >= room.capacity ? 'occupied' : 'available'
      }
    }))
    toast.success('Student allocated to room')
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.includes(searchQuery) || 
                          room.occupants.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBlock = blockFilter === 'all' || room.block === blockFilter
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter
    return matchesSearch && matchesBlock && matchesStatus
  })

  const stats = {
    totalRooms: rooms.length,
    totalBeds: rooms.reduce((sum, r) => sum + r.capacity, 0),
    occupiedBeds: rooms.reduce((sum, r) => sum + r.occupied, 0),
    availableBeds: rooms.reduce((sum, r) => sum + (r.capacity - r.occupied), 0),
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    occupancyRate: Math.round((rooms.reduce((sum, r) => sum + r.occupied, 0) / rooms.reduce((sum, r) => sum + r.capacity, 0)) * 100)
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
          <h1 className="text-2xl font-bold">Hostel Management</h1>
          <p className="text-muted-foreground">Manage rooms, allocations, and occupancy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Hostel settings are available in the admin settings panel')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setIsAddRoomOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
              <h3 className="text-xl font-bold">{stats.totalRooms}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Bed className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Beds</p>
              <h3 className="text-xl font-bold">{stats.totalBeds}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupied</p>
              <h3 className="text-xl font-bold">{stats.occupiedBeds}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <h3 className="text-xl font-bold">{stats.availableBeds}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <span className="font-bold text-primary">{stats.occupancyRate}%</span>
            </div>
            <Progress value={stats.occupancyRate} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search rooms or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="pl-10"
            />
          </div>
          <Select value={blockFilter} onValueChange={setBlockFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {blockOptions.map(block => (
                <SelectItem key={block} value={block}>Block {block}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Rooms Grid */}
      <motion.div 
        variants={itemVariants}
        className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
        )}
      >
        {filteredRooms.map((room) => {
          const StatusIcon = statusConfig[room.status].icon
          return (
            <Card 
              key={room.id} 
              className={cn(
                "p-4 hover:border-primary/50 transition-all group",
                room.status === 'maintenance' && "border-amber-500/30"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                    room.status === 'available' ? "bg-emerald-500/10 text-emerald-400" :
                    room.status === 'maintenance' ? "bg-amber-500/10 text-amber-400" :
                    "bg-blue-500/10 text-blue-400"
                  )}>
                    {room.block}{room.number}
                  </div>
                  <div>
                    <h3 className="font-semibold">Room {room.number}</h3>
                    <p className="text-sm text-muted-foreground">Block {room.block} • Floor {room.floor}</p>
                  </div>
                </div>
                <Badge className={statusConfig[room.status].color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[room.status].label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span>{room.occupied}/{room.capacity} beds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Fee</span>
                  <span className="font-medium">{formatCurrency(room.fee)}</span>
                </div>
              </div>

              {room.occupants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Occupants</p>
                  <div className="flex flex-wrap gap-2">
                    {room.occupants.map((occupant, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[10px]">{getInitials(occupant)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{occupant}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedRoom(room)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {room.status === 'available' && (
                  <Button size="sm" className="flex-1" onClick={() => handleAllocateRoom(room.id)}>
                    <Key className="w-4 h-4 mr-1" />
                    Allocate
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </motion.div>

      {filteredRooms.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </Card>
      )}

      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Create a new hostel room with fee details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Room Number</Label>
              <Input
                value={newRoom.number}
                onChange={(event) => setNewRoom((previous) => ({ ...previous, number: event.target.value }))}
                placeholder="e.g., 301"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Block</Label>
                <Select value={newRoom.block} onValueChange={(value) => setNewRoom((previous) => ({ ...previous, block: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Block A</SelectItem>
                    <SelectItem value="B">Block B</SelectItem>
                    <SelectItem value="C">Block C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Input
                  type="number"
                  min="1"
                  value={newRoom.floor}
                  onChange={(event) => setNewRoom((previous) => ({ ...previous, floor: event.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={newRoom.type} onValueChange={(value) => setNewRoom((previous) => ({ ...previous, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Fee</Label>
                <Input
                  type="number"
                  min="0"
                  value={newRoom.fee}
                  onChange={(event) => setNewRoom((previous) => ({ ...previous, fee: event.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRoom}>Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedRoom)} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>{selectedRoom ? `Block ${selectedRoom.block} • Room ${selectedRoom.number}` : ''}</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Type:</span> {selectedRoom.type}</p>
              <p><span className="text-muted-foreground">Occupancy:</span> {selectedRoom.occupied}/{selectedRoom.capacity}</p>
              <p><span className="text-muted-foreground">Status:</span> {statusConfig[selectedRoom.status].label}</p>
              <p><span className="text-muted-foreground">Monthly Fee:</span> {formatCurrency(selectedRoom.fee)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
