'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Bell,
  BellRing,
  Users,
  UserPlus,
  X,
  Plug,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Camera,
  Save,
  Send,
  CreditCard,
  Server,
  Key,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { containerVariants, itemVariants } from '@/lib/animations'
import { useAppStore } from '@/lib/store'
import { demoTeamMembers } from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Integration Data ─────────────────────────────────────────────────────────

const integrations = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Connect your OpenAI API key for AI-powered features',
    icon: <Sparkles className="h-5 w-5" />,
    connected: true,
    category: 'AI',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Payment gateway for subscription billing',
    icon: <CreditCard className="h-5 w-5" />,
    connected: true,
    category: 'Payments',
  },
  {
    id: 'smtp',
    name: 'SMTP Server',
    description: 'Email server for transactional and outreach emails',
    icon: <Server className="h-5 w-5" />,
    connected: false,
    category: 'Email',
  },
]

// ─── Main Settings Component ──────────────────────────────────────────────────

export default function Settings() {
  const { user, setUser } = useAppStore()

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [profileCompany, setProfileCompany] = useState(user?.company || '')
  const [profileRole, setProfileRole] = useState(user?.role || '')

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Team state
  const [teamMembers, setTeamMembers] = useState(demoTeamMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  // Integrations state
  const [integrationStates, setIntegrationStates] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  )
  const [configureOpen, setConfigureOpen] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')

  // Danger zone
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  // Profile save
  const handleSaveProfile = () => {
    if (!user) return
    setUser({
      ...user,
      name: profileName,
      email: profileEmail,
      company: profileCompany,
      role: profileRole,
    })
    toast.success('Profile updated', {
      description: 'Your profile information has been saved.',
    })
  }

  // Invite member
  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address.',
      })
      return
    }
    toast.success('Invitation sent', {
      description: `An invite has been sent to ${inviteEmail}`,
    })
    setInviteEmail('')
    setInviteOpen(false)
  }

  // Remove team member
  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id))
    toast.success('Member removed', {
      description: 'Team member has been removed from your workspace.',
    })
  }

  // Toggle integration
  const handleToggleIntegration = (id: string) => {
    setIntegrationStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    const newState = !integrationStates[id]
    toast.success(newState ? 'Integration connected' : 'Integration disconnected', {
      description: `${integrations.find((i) => i.id === id)?.name} has been ${newState ? 'connected' : 'disconnected'}.`,
    })
  }

  // Configure integration
  const handleConfigureIntegration = (id: string) => {
    setConfigureOpen(id)
    setApiKey('')
  }

  const handleSaveIntegration = () => {
    toast.success('Configuration saved', {
      description: `${integrations.find((i) => i.id === configureOpen)?.name} settings have been updated.`,
    })
    setConfigureOpen(null)
    setApiKey('')
  }

  // Delete account
  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Confirmation failed', {
        description: 'Please type DELETE to confirm.',
      })
      return
    }
    toast.success('Account deletion requested', {
      description: 'Your account will be deleted within 30 days.',
    })
    setDeleteOpen(false)
    setDeleteConfirm('')
  }

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Profile Section ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={user?.avatar || undefined} alt={profileName} />
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                    {profileName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-base font-semibold">{profileName}</p>
                <p className="text-sm text-muted-foreground">{profileEmail}</p>
                <Badge className="mt-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold uppercase">
                  {user?.plan || 'pro'} Plan
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Company
                </Label>
                <Input
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Role
                </Label>
                <Select value={profileRole} onValueChange={setProfileRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agency_owner">Agency Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales_lead">Sales Lead</SelectItem>
                    <SelectItem value="account_manager">Account Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveProfile}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* ─── Notifications Preferences ─────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Email Notifications</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive email alerts for important updates
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Push Notifications</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get browser push notifications for real-time updates
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Weekly Digest</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get a weekly summary of your account activity
                </p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Team Section ──────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">Team Members</CardTitle>
                </div>
                <CardDescription>
                  Manage your team and invite new members
                </CardDescription>
              </div>
              <Button
                onClick={() => setInviteOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0 bg-muted">
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No team members yet</p>
                  <p className="text-xs text-muted-foreground">Invite members to collaborate</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Integrations ──────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Connect third-party services to enhance your workflow
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const isConnected = integrationStates[integration.id]

            return (
              <Card
                key={integration.id}
                className={cn(
                  'transition-all duration-300 hover:shadow-md',
                  isConnected && 'border-emerald-500/30'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          isConnected
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{integration.name}</CardTitle>
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1 py-0 mt-0.5 border-0"
                        >
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    {isConnected ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-xs text-muted-foreground">
                    {integration.description}
                  </p>
                  <div className="mt-2">
                    <Badge
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wide border-0',
                        isConnected
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant={isConnected ? 'outline' : 'default'}
                    size="sm"
                    className={cn(
                      'flex-1',
                      !isConnected && 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    )}
                    onClick={() => handleToggleIntegration(integration.id)}
                  >
                    <Plug className="mr-1.5 h-3.5 w-3.5" />
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                  {isConnected && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleConfigureIntegration(integration.id)}
                    >
                      <Key className="mr-1.5 h-3.5 w-3.5" />
                      Configure
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* ─── Danger Zone ───────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4 gap-4">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Invite Member Dialog ──────────────────────────────────────────── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-500" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Email Address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInviteMember()
                }}
              />
              <p className="text-xs text-muted-foreground">
                They&apos;ll receive an email with a link to join your team
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInviteMember}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Configure Integration Dialog ──────────────────────────────────── */}
      <Dialog
        open={!!configureOpen}
        onOpenChange={(open) => {
          if (!open) setConfigureOpen(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-500" />
              Configure {integrations.find((i) => i.id === configureOpen)?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials for this integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">API Key</Label>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your key is encrypted and stored securely
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureOpen(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveIntegration}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Account Alert Dialog ───────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All your data, including leads,
              audits, proposals, and team information will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-sm font-medium text-red-600 dark:text-red-400">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </Label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE here"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
