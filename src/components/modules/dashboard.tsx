'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  UserPlus,
  ClipboardCheck,
  Mail,
  GitBranch,
  Search,
  Megaphone,
  FileCheck,
  Zap,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { cn } from '@/lib/utils'
import {
  demoRevenueData,
  demoLeadSourceData,
  demoPipelineData,
  demoActivities,
  demoTeamMembers,
} from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

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

// ─── Sparkline Data ───────────────────────────────────────────────────────────

const revenueSparkline = [
  { v: 12 }, { v: 15 }, { v: 18 }, { v: 22 },
  { v: 28 }, { v: 32 }, { v: 35 },
]
const leadsSparkline = [
  { v: 24 }, { v: 31 }, { v: 28 }, { v: 35 },
  { v: 42 }, { v: 48 }, { v: 52 },
]
const conversionSparkline = [
  { v: 12.5 }, { v: 14.3 }, { v: 13.8 }, { v: 15.1 },
  { v: 16.0 }, { v: 17.2 }, { v: 18.2 },
]
const proposalsSparkline = [
  { v: 5 }, { v: 7 }, { v: 6 }, { v: 8 },
  { v: 9 }, { v: 10 }, { v: 12 },
]

// ─── Emerald Color Palette ────────────────────────────────────────────────────

const EMERALD = '#10b981'
const EMERALD_LIGHT = '#34d399'
const EMERALD_DARK = '#059669'
const TEAL = '#14b8a6'
const GREEN = '#22c55e'
const LIME = '#84cc16'
const AMBER = '#f59e0b'

const PIE_COLORS = [EMERALD, TEAL, GREEN, LIME, AMBER]

// ─── KPI Card Config ──────────────────────────────────────────────────────────

interface KPICardProps {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  changeType: 'up' | 'down'
  subtext: string
  sparkData: { v: number }[]
  sparkKey: string
}

function KPICard({ icon, label, value, change, changeType, subtext, sparkData, sparkKey }: KPICardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <div className="flex items-center gap-1.5">
              {changeType === 'up' ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-semibold',
                  changeType === 'up'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-500'
                )}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">{subtext}</span>
            </div>
          </div>
          <div className="h-12 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${sparkKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={EMERALD} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={EMERALD}
                  strokeWidth={1.5}
                  fill={`url(#spark-${sparkKey})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Activity Icon Helper ─────────────────────────────────────────────────────

function getActivityIcon(type: string) {
  switch (type) {
    case 'lead_created':
      return <UserPlus className="h-4 w-4" />
    case 'audit_completed':
      return <ClipboardCheck className="h-4 w-4" />
    case 'proposal_accepted':
      return <FileCheck className="h-4 w-4" />
    case 'outreach_sent':
      return <Mail className="h-4 w-4" />
    case 'lead_status_change':
      return <GitBranch className="h-4 w-4" />
    case 'audit_started':
      return <Search className="h-4 w-4" />
    case 'proposal_sent':
      return <FileText className="h-4 w-4" />
    default:
      return <Zap className="h-4 w-4" />
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'lead_created':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'audit_completed':
      return 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
    case 'proposal_accepted':
      return 'bg-green-500/10 text-green-600 dark:text-green-400'
    case 'outreach_sent':
      return 'bg-lime-500/10 text-lime-600 dark:text-lime-400'
    case 'lead_status_change':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'audit_started':
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
    case 'proposal_sent':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function PipelineTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; payload: { stage: string; count: number; value: number } }> }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{data.stage}</p>
      <div className="text-muted-foreground">
        <span>Count: </span><span className="font-medium text-foreground">{data.count}</span>
      </div>
      <div className="text-muted-foreground">
        <span>Value: </span><span className="font-medium text-foreground">${data.value.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const today = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  const activitiesWithRelativeTime = useMemo(() => {
    return demoActivities.map((activity) => ({
      ...activity,
      relativeTime: formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }),
    }))
  }, [])

  const maxPipelineValue = useMemo(
    () => Math.max(...demoPipelineData.map((d) => d.value)),
    []
  )

  const aiCreditsUsed = 1568
  const aiCreditsLimit = 2500
  const aiCreditsPercent = (aiCreditsUsed / aiCreditsLimit) * 100

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Welcome Banner ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0">
          <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Welcome back, Alex! 👋
              </h1>
              <p className="mt-1 text-sm text-emerald-100 md:text-base">{today}</p>
              <p className="mt-2 text-sm text-emerald-50/80 md:text-base">
                Your pipeline is looking strong — let&apos;s turn those leads into wins today.
              </p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
              <Sparkles className="h-32 w-32 text-white" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ─── KPI Cards Row ────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KPICard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value="$128,500"
          change="+12.5%"
          changeType="up"
          subtext="from last month"
          sparkData={revenueSparkline}
          sparkKey="revenue"
        />
        <KPICard
          icon={<Users className="h-5 w-5" />}
          label="Active Leads"
          value="47"
          change="+8"
          changeType="up"
          subtext="this week"
          sparkData={leadsSparkline}
          sparkKey="leads"
        />
        <KPICard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Conversion Rate"
          value="18.2%"
          change="+2.1%"
          changeType="up"
          subtext="improvement"
          sparkData={conversionSparkline}
          sparkKey="conversion"
        />
        <KPICard
          icon={<FileText className="h-5 w-5" />}
          label="Proposals Sent"
          value="12"
          change="3"
          changeType="up"
          subtext="pending response"
          sparkData={proposalsSparkline}
          sparkKey="proposals"
        />
      </motion.div>

      {/* ─── Charts Row ───────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={EMERALD} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
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
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">{value === 'revenue' ? 'Revenue' : 'Leads'}</span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={EMERALD}
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: EMERALD, stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke={TEAL}
                    strokeWidth={1.5}
                    fill="url(#leadsGradient)"
                    dot={false}
                    activeDot={{ r: 3, fill: TEAL, stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Sources</CardTitle>
            <CardDescription>Distribution of leads by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demoLeadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {demoLeadSourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-background)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Pipeline Overview ────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Overview</CardTitle>
            <CardDescription>Deal flow across pipeline stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demoPipelineData}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pipelineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={EMERALD_DARK} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={EMERALD_LIGHT} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip content={<PipelineTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="url(#pipelineGradient)"
                    radius={[0, 6, 6, 0]}
                    barSize={28}
                  >
                    {demoPipelineData.map((entry, index) => (
                      <Cell
                        key={`pipeline-cell-${index}`}
                        fill={
                          index === demoPipelineData.length - 1
                            ? EMERALD
                            : index === 0
                              ? '#a7f3d0'
                              : undefined
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pipeline Summary Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {demoPipelineData.map((stage, i) => (
                <div key={stage.stage} className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{stage.stage}</p>
                  <p className="text-lg font-bold text-foreground">{stage.count}</p>
                  <p className="text-xs text-muted-foreground">
                    ${(stage.value / 1000).toFixed(0)}k
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Activity Feed + Team Performance ─────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[380px] pr-3">
              <div className="space-y-4">
                {activitiesWithRelativeTime.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                      index === 0 && 'bg-emerald-500/5'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        getActivityColor(activity.type)
                      )}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {activity.relativeTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Performance</CardTitle>
            <CardDescription>Individual metrics this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoTeamMembers.map((member) => (
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
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {member.role}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {member.leads} leads
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${(member.revenue / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {member.conversionRate}%
                      </span>
                    </div>
                  </div>
                  {/* Mini performance bar */}
                  <div className="hidden sm:block w-20">
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(member.conversionRate * 4, 100)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
                      {member.conversionRate}% conv.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── AI Usage Stats ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">AI Usage Stats</CardTitle>
            </div>
            <CardDescription>
              Credits used this billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Main usage bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Credits Used
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {aiCreditsUsed.toLocaleString()} / {aiCreditsLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={aiCreditsPercent} className="h-3" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {(aiCreditsLimit - aiCreditsUsed).toLocaleString()} credits remaining
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Audits</p>
                      <p className="text-lg font-bold text-foreground">680</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${(680 / aiCreditsUsed) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {((680 / aiCreditsUsed) * 100).toFixed(0)}% of usage
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
                      <Megaphone className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Outreach</p>
                      <p className="text-lg font-bold text-foreground">520</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-teal-500"
                      style={{ width: `${(520 / aiCreditsUsed) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {((520 / aiCreditsUsed) * 100).toFixed(0)}% of usage
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Proposals</p>
                      <p className="text-lg font-bold text-foreground">368</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ width: `${(368 / aiCreditsUsed) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {((368 / aiCreditsUsed) * 100).toFixed(0)}% of usage
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
