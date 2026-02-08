import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Key,
  Globe,
  Save,
  Upload,
  Check,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Settings() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Profile Information</CardTitle>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl">AD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="User" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="admin@erpsystem.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Role</Label>
                    <Input defaultValue="System Administrator" disabled />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={handleSave}>
                  {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Notification Preferences</CardTitle>
              <div className="space-y-6">
                {[
                  { title: 'Email Notifications', description: 'Receive email updates for important events', enabled: true },
                  { title: 'New Admissions', description: 'Get notified when new applications are submitted', enabled: true },
                  { title: 'Payment Alerts', description: 'Notifications for fee payments and reminders', enabled: true },
                  { title: 'Hostel Updates', description: 'Room allocation and maintenance updates', enabled: false },
                  { title: 'System Updates', description: 'Updates about system maintenance and features', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        item.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                          item.enabled ? "translate-x-7" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Change Password</CardTitle>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Two-Factor Authentication</CardTitle>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Badge variant="secondary" className="mt-2">Not Enabled</Badge>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Active Sessions</CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Chrome on macOS</p>
                      <p className="text-xs text-muted-foreground">Bangalore, India • Current Session</p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Theme</CardTitle>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {['Dark', 'Light', 'System'].map((theme) => (
                  <button
                    key={theme}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-colors text-center",
                      theme === 'Dark' ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-full h-12 rounded-md mb-2",
                      theme === 'Dark' ? "bg-gray-900" : theme === 'Light' ? "bg-white" : "bg-gradient-to-r from-gray-900 to-white"
                    )} />
                    <span className="text-sm font-medium">{theme}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Accent Color</CardTitle>
              <div className="flex gap-3">
                {[
                  { name: 'Blue', color: '#3b82f6' },
                  { name: 'Purple', color: '#8b5cf6' },
                  { name: 'Green', color: '#10b981' },
                  { name: 'Orange', color: '#f59e0b' },
                  { name: 'Rose', color: '#f43f5e' },
                ].map((accent) => (
                  <button
                    key={accent.name}
                    className={cn(
                      "w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-110",
                      accent.name === 'Blue' ? "ring-primary" : "ring-transparent"
                    )}
                    style={{ backgroundColor: accent.color }}
                    title={accent.name}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">System Information</CardTitle>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Database</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span>Feb 9, 2026 at 3:00 AM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span>2.4 GB / 10 GB</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardTitle className="text-lg mb-2">Data Management</CardTitle>
              <CardDescription className="mb-6">Export or backup your system data</CardDescription>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
