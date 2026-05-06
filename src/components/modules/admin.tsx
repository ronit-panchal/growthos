'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Trash2,
  Sparkles,
  Megaphone,
  FileText,
  Cog,
  ScrollText,
  UserCheck,
  UserX,
  Settings,
  Zap,
  BarChart3,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import { cn } from '@/lib/utils'
import { demoAdminStats, demoRecentUsers, demoRevenueData } from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// ─── Emerald Color Palette ────────────────────────────────────────────────────

const EMERALD = '#10b981'
const EMERALD_LIGHT = '#34d399'
const EMERALD_DARK = '#059669'
const TEAL = '#14b8a6'
const GREEN = '#22c55e'
const LIME = '#84cc16'
const AMBER = '#f59e0b'

// ─── AI Usage Breakdown Data ──────────────────────────────────────────────────

const aiUsageBreakdown = [
  { category: 'Audits', credits: 8200, color: EMERALD },
  { category: 'Outreach', credits: 4800, color: TEAL },
  { category: 'Proposals', credits: 2680, color: GREEN },
]

// ─── Audit Log Data ───────────────────────────────────────────────────────────

const auditLogEntries = [
  { id: 'log-1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), userEmail: 'alex@growthagency.io', action: 'update', description: 'Changed default plan from Starter to Pro' },
  { id: 'log-2', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), userEmail: 'alex@growthagency.io', action: 'suspend', description: 'Suspended user account: spam_user@fake.com' },
  { id: 'log-3', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), userEmail: 'jordan@growthagency.io', action: 'create', description: 'Created new team member account: casey@growthagency.io' },
  { id: 'log-4', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), userEmail: 'alex@growthagency.io', action: 'update', description: 'Increased max audit limit from 25 to 30' },
  { id: 'log-5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), userEmail: 'system@growthos.io', action: 'system', description: 'Automated backup completed successfully' },
  { id: 'log-6', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), userEmail: 'alex@growthagency.io', action: 'delete', description: 'Deleted inactive user: old_client@company.com' },
  { id: 'log-7', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), userEmail: 'jordan@growthagency.io', action: 'update', description: 'Updated billing settings for Enterprise plan' },
  { id: 'log-8', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), userEmail: 'alex@growthagency.io', action: 'update', description: 'Enabled maintenance mode for 15 minutes' },
  { id: 'log-9', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), userEmail: 'system@growthos.io', action: 'system', description: 'AI credits reset for new billing period' },
  { id: 'log-10', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), userEmail: 'alex@growthagency.io', action: 'create', description: 'Provisioned new Enterprise workspace for Priya Sharma' },
]

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name === 'revenue' ? 'Revenue' : entry.name}:</span>
          <span className="font-medium text-foreground">
            {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function UsageTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string; payload: { category: string; credits: number } }>; label?: string }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{data.category}</p>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Credits:</span>
        <span className="font-medium text-foreground">{data.credits.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ─── Audit Log Action Icon/Color ──────────────────────────────────────────────

function getActionStyle(action: string) {
  switch (action) {
    case 'create':
      return { icon: <UserCheck className="h-3.5 w-3.5" />, bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' }
    case 'update':
      return { icon: <Settings className="h-3.5 w-3.5" />, bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400' }
    case 'delete':
      return { icon: <UserX className="h-3.5 w-3.5" />, bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400' }
    case 'suspend':
      return { icon: <Ban className="h-3.5 w-3.5" />, bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' }
    case 'system':
      return { icon: <Zap className="h-3.5 w-3.5" />, bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' }
    default:
      return { icon: <Activity className="h-3.5 w-3.5" />, bg: 'bg-muted', text: 'text-muted-foreground' }
  }
}

function getActionBadgeVariant(action: string) {
  switch (action) {
    case 'create': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'update': return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
    case 'delete': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    case 'suspend': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'system': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
    default: return 'bg-muted text-muted-foreground border-border'
  }
}

// ─── Main Admin Module ────────────────────────────────────────────────────────

export default function AdminModule() {
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'suspend' | 'delete'; user: typeof demoRecentUsers[0] | null }>({
    open: false,
    type: 'suspend',
    user: null,
  })
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [auditLimit, setAuditLimit] = useState([25])
  const [defaultPlan, setDefaultPlan] = useState('pro')

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return demoRecentUsers
    const q = searchQuery.toLowerCase()
    return demoRecentUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Stats data
  const statsCards = [
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Total Users',
      value: demoAdminStats.totalUsers.toLocaleString(),
      change: '+12',
      changeType: 'up' as const,
      subtext: 'this week',
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      label: 'Active Users',
      value: demoAdminStats.activeUsers.toLocaleString(),
      change: `${((demoAdminStats.activeUsers / demoAdminStats.totalUsers) * 100).toFixed(1)}%`,
      changeType: 'up' as const,
      subtext: 'of total',
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'MRR',
      value: `$${demoAdminStats.monthlyRecurring.toLocaleString()}`,
      change: '+$3,100',
      changeType: 'up' as const,
      subtext: 'this month',
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'Total Revenue',
      value: `$${demoAdminStats.totalRevenue.toLocaleString()}`,
      change: '+18.5%',
      changeType: 'up' as const,
      subtext: 'from last year',
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      label: 'Churn Rate',
      value: `${demoAdminStats.churnRate}%`,
      change: '-0.5%',
      changeType: 'down' as const,
      subtext: 'improved',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'ARPU',
      value: `$${demoAdminStats.avgRevenuePerUser}`,
      change: '+$12',
      changeType: 'up' as const,
      subtext: 'this month',
    },
  ]

  const handleConfirmAction = () => {
    if (!confirmDialog.user) return
    if (confirmDialog.type === 'suspend') {
      toast.success(`User ${confirmDialog.user.name} has been suspended`, {
        description: 'They will not be able to access the platform.',
      })
    } else {
      toast.success(`User ${confirmDialog.user.name} has been deleted`, {
        description: 'All associated data has been removed.',
      })
    }
    setConfirmDialog({ open: false, type: 'suspend', user: null })
  }

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully', {
      description: `Maintenance: ${maintenanceMode ? 'On' : 'Off'}, Audit Limit: ${auditLimit[0]}, Default Plan: ${defaultPlan}`,
    })
  }

  const getPlanBadgeStyle = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free': return 'bg-muted text-muted-foreground border-border'
      case 'starter': return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
      case 'pro': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'enterprise': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'trialing': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'suspended': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const aiCreditsPercent = (demoAdminStats.aiCreditsUsed / demoAdminStats.aiCreditsLimit) * 100

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Platform administration &amp; monitoring</p>
        </div>
      </motion.div>

      {/* ─── 1. Platform Stats Row ─────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      >
        {statsCards.map((stat) => (
          <Card
            key={stat.label}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/50"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground truncate">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1.5">
                {stat.changeType === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span
                  className={cn(
                    'text-xs font-semibold',
                    stat.label === 'Churn Rate'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : stat.changeType === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500'
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground truncate">{stat.subtext}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ─── 2. Revenue Chart ──────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trend over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={EMERALD} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={EMERALD}
                    strokeWidth={2.5}
                    fill="url(#adminRevenueGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: EMERALD, stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── 3. User Management Table ──────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>Manage platform users and access</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No users found matching &quot;{searchQuery}&quot;
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
                              getPlanBadgeStyle(user.plan)
                            )}
                          >
                            {user.plan}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize',
                              getStatusBadgeStyle(user.status)
                            )}
                          >
                            <span
                              className={cn(
                                'mr-1 h-1.5 w-1.5 rounded-full',
                                user.status === 'active'
                                  ? 'bg-emerald-500'
                                  : user.status === 'trialing'
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                              )}
                            />
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  toast.info(`Viewing details for ${user.name}`, {
                                    description: `Email: ${user.email} | Plan: ${user.plan}`,
                                  })
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({ open: true, type: 'suspend', user })
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  setConfirmDialog({ open: true, type: 'delete', user })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── 4. AI Usage Overview ──────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* AI Credits + Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">AI Usage Overview</CardTitle>
            </div>
            <CardDescription>Credits used this billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credits progress */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Credits Used</span>
                <span className="text-sm text-muted-foreground">
                  {demoAdminStats.aiCreditsUsed.toLocaleString()} / {demoAdminStats.aiCreditsLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={aiCreditsPercent} className="h-3" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {(demoAdminStats.aiCreditsLimit - demoAdminStats.aiCreditsUsed).toLocaleString()} credits remaining
                ({(100 - aiCreditsPercent).toFixed(1)}%)
              </p>
            </div>

            {/* Three stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 mx-auto mb-2">
                  <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{demoAdminStats.auditsThisMonth}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Audits This Month</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 mx-auto mb-2">
                  <Megaphone className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-lg font-bold text-foreground">520</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Outreach</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 mx-auto mb-2">
                  <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{demoAdminStats.proposalsThisMonth}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Proposals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Breakdown Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Usage Breakdown</CardTitle>
            </div>
            <CardDescription>AI credit distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={aiUsageBreakdown}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="auditBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={EMERALD_LIGHT} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={EMERALD_DARK} stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="outreachBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="proposalBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GREEN} stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<UsageTooltip />} />
                  <Bar dataKey="credits" radius={[6, 6, 0, 0]} barSize={56}>
                    {aiUsageBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? 'url(#auditBarGradient)'
                            : index === 1
                              ? 'url(#outreachBarGradient)'
                              : 'url(#proposalBarGradient)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── 5. System Settings + 6. Audit Log ────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">System Settings</CardTitle>
            </div>
            <CardDescription>Configure platform behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Temporarily disable platform access for non-admins
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            {/* Max Audit Limit Slider */}
            <div className="space-y-3 rounded-lg border border-border/50 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Max Audit Limit</Label>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {auditLimit[0]}
                </span>
              </div>
              <Slider
                value={auditLimit}
                onValueChange={setAuditLimit}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>50</span>
              </div>
            </div>

            {/* Default Plan Selector */}
            <div className="space-y-2 rounded-lg border border-border/50 p-4">
              <Label className="text-sm font-medium">Default Plan</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Plan assigned to new users on signup
              </p>
              <Select value={defaultPlan} onValueChange={setDefaultPlan}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveSettings}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Audit Log</CardTitle>
            </div>
            <CardDescription>Recent platform actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80 pr-3">
              <div className="space-y-3">
                {auditLogEntries.map((entry, index) => {
                  const actionStyle = getActionStyle(entry.action)
                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                        index === 0 && 'bg-emerald-500/5'
                      )}
                    >
                      <div
                        className={cn(
                          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                          actionStyle.bg,
                          actionStyle.text
                        )}
                      >
                        {actionStyle.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-foreground">
                            {entry.userEmail}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium border capitalize',
                              getActionBadgeVariant(entry.action)
                            )}
                          >
                            {entry.action}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {entry.description}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Confirmation Dialog ───────────────────────────────────────────── */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ open: false, type: 'suspend', user: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'suspend' ? 'Suspend User' : 'Delete User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'suspend'
                ? `Are you sure you want to suspend ${confirmDialog.user?.name}? They will lose access to the platform immediately.`
                : `Are you sure you want to delete ${confirmDialog.user?.name}? This action is irreversible and all associated data will be permanently removed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmDialog.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }
            >
              {confirmDialog.type === 'suspend' ? 'Suspend' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
