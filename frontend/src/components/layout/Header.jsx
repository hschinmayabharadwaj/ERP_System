import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Moon, 
  Sun,
  LogOut,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import dashboardService from '@/lib/dashboard'
import { toast } from 'sonner'

const pageTitles = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/admissions': 'Admissions',
  '/fees': 'Fee Management',
  '/payments': 'Payments',
  '/hostel': 'Hostel Management',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout } = useAuth()
  
  const currentPage = pageTitles[location.pathname] || 'Page'

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const overview = await dashboardService.getOverview()
        const notifs = []
        if (overview?.recentAdmissions) {
          overview.recentAdmissions.slice(0, 2).forEach((adm, i) => {
            const name = `${adm.personalInfo?.firstName || ''} ${adm.personalInfo?.lastName || ''}`.trim()
            notifs.push({
              id: `adm-${i}`,
              title: `Admission ${adm.status}: ${name || 'Student'}`,
              time: adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : '',
              unread: adm.status === 'pending',
            })
          })
        }
        if (overview?.recentPayments) {
          overview.recentPayments.slice(0, 2).forEach((pay, i) => {
            const name = pay.studentId
              ? `${pay.studentId.personalInfo?.firstName || ''} ${pay.studentId.personalInfo?.lastName || ''}`.trim() || pay.studentId?.studentId || ''
              : ''
            notifs.push({
              id: `pay-${i}`,
              title: `Payment ${formatCurrency(pay.amount)} from ${name}`,
              time: pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : '',
              unread: true,
            })
          })
        }
        setNotifications(notifs)
      } catch {
        // If fetch fails, leave notifications empty
      }
    }
    if (user) fetchNotifications()
  }, [user])

  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U'
    const first = user.firstName?.[0] || user.name?.[0] || ''
    const last = user.lastName?.[0] || ''
    return (first + last).toUpperCase() || 'U'
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-xl">
      {/* Left Section - Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <motion.h1 
          key={currentPage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold"
        >
          {currentPage}
        </motion.h1>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search students, fees, reports..."
            icon={Search}
            className="w-full bg-muted/50 border-0 focus-visible:ring-1 pl-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground text-xs">
            <kbd className="px-1.5 py-0.5 bg-background rounded border">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-background rounded border">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Add Button */}
        <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => navigate('/admissions')}>
          <Plus className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  notification.unread ? "bg-primary" : "bg-muted"
                )} />
                <div className="flex-1">
                  <p className={cn(
                    "text-sm",
                    notification.unread ? "font-medium" : "text-muted-foreground"
                  )}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary"
              onClick={() => {
                setNotifications((previous) => previous.map((notification) => ({ ...notification, unread: false })))
                toast.success('All notifications marked as read')
              }}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
          onClick={() => window.open('https://github.com', '_blank', 'noopener,noreferrer')}
        >
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.picture || "/avatar.jpg"} alt={user?.name || "User"} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium">{user?.name || user?.firstName || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'Administrator'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || user?.firstName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
