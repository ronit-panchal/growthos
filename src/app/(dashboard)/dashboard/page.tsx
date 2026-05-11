import Link from 'next/link'
import { getServerSession } from 'next-auth'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  FileText,
  LineChart,
  Megaphone,
  SearchCheck,
  Sparkles,
  Target,
  History,
} from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getDatabaseConnectionHint } from '@/lib/runtime-diagnostics'
import { formatCurrency } from '@/lib/utils'
import { OverviewCharts } from '@/components/dashboard/overview-charts'
import { ActivityHistory, ActivitySummary } from '@/components/activity-history'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const leadStatusColors: Record<string, string> = {
  new: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
  contacted: 'bg-violet-500/12 text-violet-600 dark:text-violet-300',
  qualified: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
  proposal: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  negotiation: 'bg-orange-500/12 text-orange-700 dark:text-orange-300',
  won: 'bg-emerald-500/16 text-emerald-700 dark:text-emerald-300',
  lost: 'bg-rose-500/12 text-rose-700 dark:text-rose-300',
}

const auditStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  running: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
  completed: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
  failed: 'bg-rose-500/12 text-rose-700 dark:text-rose-300',
}

const ADMIN_ROLES = new Set(['admin', 'agency_owner', 'super_admin', 'superadmin', 'developer'])

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }

  const userId = session.user.id
  const canAccessAdmin = ADMIN_ROLES.has(session.user.role || '')
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const dashboardData = await Promise.all([
    db.lead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
        score: true,
        value: true,
        createdAt: true,
      },
    }),
    db.auditJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        status: true,
        overallScore: true,
        createdAt: true,
      },
    }),
    db.outreachCampaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        tone: true,
        status: true,
        createdAt: true,
      },
    }),
    db.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        totalValue: true,
        createdAt: true,
      },
    }),
    db.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        createdAt: true,
      },
    }),
  ])
    .then(([leads, audits, campaigns, proposals, recentActivities]) => ({
      leads,
      audits,
      campaigns,
      proposals,
      recentActivities,
    }))
    .catch((error) => {
      console.error('Failed to load dashboard data:', error)
      return null
    })

  if (!dashboardData) {
    const databaseHint = getDatabaseConnectionHint()

    return (
      <Card className="border-amber-500/30 bg-amber-500/8 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-amber-500/12 p-2 text-amber-600 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Workspace database needs attention</CardTitle>
              <CardDescription>Your local app is running, but dashboard data could not load.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{databaseHint}</p>
          <p>
            For Supabase local development, open the project dashboard and copy the connection pooling
            string into <code>DATABASE_URL</code> in <code>.env.local</code>, then restart{' '}
            <code>npm run dev</code>.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { leads, audits, campaigns, proposals, recentActivities } = dashboardData

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter((lead) => ['qualified', 'proposal', 'negotiation'].includes(lead.status)).length
  const wonLeads = leads.filter((lead) => lead.status === 'won')
  const pipelineValue = leads
    .filter((lead) => !['won', 'lost'].includes(lead.status))
    .reduce((sum, lead) => sum + lead.value, 0)
  const wonValue = wonLeads.reduce((sum, lead) => sum + lead.value, 0)
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0
  const monthlyRevenue = proposals
    .filter((proposal) => proposal.status === 'accepted' && proposal.createdAt >= startOfMonth)
    .reduce((sum, proposal) => sum + proposal.totalValue, 0)
  const completedAudits = audits.filter((audit) => audit.status === 'completed').length
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active').length
  const proposalsSent = proposals.filter((proposal) => ['sent', 'viewed', 'accepted'].includes(proposal.status)).length
  const averageDealValue = wonLeads.length > 0 ? Math.round(wonValue / wonLeads.length) : 0

  const stageOrder = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']
  const pipeline = stageOrder.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.status === stage).length,
  }))

  const trend = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = monthKey(date)
    return {
      key,
      label: date.toLocaleString('en-US', { month: 'short' }),
      leads: leads.filter((lead) => monthKey(lead.createdAt) === key).length,
      audits: audits.filter((audit) => monthKey(audit.createdAt) === key).length,
      proposals: proposals.filter((proposal) => monthKey(proposal.createdAt) === key).length,
    }
  })

  const activityMap = new Map<string, number>()
  for (const activity of recentActivities) {
    activityMap.set(activity.type, (activityMap.get(activity.type) || 0) + 1)
  }
  const activityMix = Array.from(activityMap.entries()).map(([type, count]) => ({ type, count }))

  const statCards = [
    {
      title: 'Pipeline value',
      value: formatCurrency(pipelineValue),
      caption: `${qualifiedLeads} qualified leads in motion`,
      icon: Target,
    },
    {
      title: 'Won revenue',
      value: formatCurrency(wonValue),
      caption: `${conversionRate}% close rate across all leads`,
      icon: BadgeCheck,
    },
    {
      title: 'Monthly revenue',
      value: formatCurrency(monthlyRevenue),
      caption: `${proposalsSent} proposals sent or active`,
      icon: LineChart,
    },
    {
      title: 'Average deal size',
      value: formatCurrency(averageDealValue),
      caption: `${completedAudits} audits completed`,
      icon: SearchCheck,
    },
  ]

  const quickActions = [
    {
      href: '/dashboard/leads?action=new',
      title: 'Capture a lead',
      body: 'Add a company, contact, and opportunity value in under a minute.',
      icon: Target,
    },
    {
      href: '/dashboard/audits?action=new',
      title: 'Run a website audit',
      body: 'Turn a URL into a sales-ready diagnostic with SEO, UX, and performance insights.',
      icon: SearchCheck,
    },
    {
      href: '/dashboard/outreach?action=new',
      title: 'Create outreach',
      body: 'Generate campaign-ready copy for follow-ups, cold email, or LinkedIn.',
      icon: Megaphone,
    },
    {
      href: '/dashboard/proposals?action=new',
      title: 'Draft a proposal',
      body: 'Package an offer, pricing, and scope into a client-ready proposal.',
      icon: FileText,
    },
  ]

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(2,6,23,0.02))] shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Revenue workspace
            </Badge>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back{session.user.name ? `, ${session.user.name}` : ''}. Your growth engine is live.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              GrowthOS keeps your pipeline, diagnostics, proposals, and follow-up systems moving together so you can sell and deliver without scattered tools.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/audits?action=new"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Start an audit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/proposals?action=new"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/70 px-5 py-3 text-sm font-medium transition hover:bg-background"
              >
                Draft a proposal
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Workspace momentum</CardTitle>
            <CardDescription>What is moving right now in your agency system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Active campaigns</p>
              <p className="mt-2 text-3xl font-semibold">{activeCampaigns}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 p-4">
                <p className="text-sm text-muted-foreground">Open proposals</p>
                <p className="mt-2 text-2xl font-semibold">{proposals.filter((proposal) => proposal.status !== 'accepted').length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 p-4">
                <p className="text-sm text-muted-foreground">Lead inflow this month</p>
                <p className="mt-2 text-2xl font-semibold">{leads.filter((lead) => lead.createdAt >= startOfMonth).length}</p>
              </div>
            </div>
            {canAccessAdmin ? (
              <Link
                href="/dashboard/admin"
                className="flex items-center justify-between rounded-3xl border border-dashed border-primary/30 bg-primary/6 px-4 py-3 text-sm"
              >
                <span>
                  <span className="block font-medium">Owner-only admin room</span>
                  <span className="text-muted-foreground">Platform-wide analytics, user growth, and operational oversight.</span>
                </span>
                <Sparkles className="h-4 w-4 text-primary" />
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="border-white/10 bg-card/85 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardDescription>{item.title}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">{item.value}</CardTitle>
                </div>
                <span className="rounded-2xl bg-primary/12 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.caption}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <OverviewCharts pipeline={pipeline} trend={trend} activityMix={activityMix.length ? activityMix : [{ type: 'workspace', count: 1 }]} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Track everything you've done in GrowthOS.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityHistory limit={5} showViewAll={true} />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Command center</CardTitle>
            <CardDescription>Fast ways to turn attention into revenue work.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-3xl border border-white/8 bg-background/70 px-4 py-4 transition hover:border-primary/30 hover:bg-background"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{action.body}</p>
                    </div>
                    <Icon className="mt-1 h-4 w-4 text-primary transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Latest leads</CardTitle>
            <CardDescription>Your newest pipeline opportunities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.company || lead.email}</p>
                </div>
                <div className="text-right">
                  <Badge className={`rounded-full border-0 ${leadStatusColors[lead.status] || 'bg-muted text-foreground'}`}>
                    {lead.status}
                  </Badge>
                  <p className="mt-2 text-sm font-medium">{lead.value > 0 ? formatCurrency(lead.value) : 'No value yet'}</p>
                </div>
              </div>
            ))}
            {leads.length === 0 ? <p className="text-sm text-muted-foreground">No leads yet.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Latest audits</CardTitle>
            <CardDescription>Most recent website analyses across your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {audits.slice(0, 5).map((audit) => (
              <div key={audit.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{audit.url}</p>
                  <p className="text-sm text-muted-foreground">
                    {audit.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`rounded-full border-0 ${auditStatusColors[audit.status] || 'bg-muted text-foreground'}`}>
                    {audit.status}
                  </Badge>
                  <p className="mt-2 text-sm font-medium">{audit.overallScore ? `${audit.overallScore}/100` : 'Pending score'}</p>
                </div>
              </div>
            ))}
            {audits.length === 0 ? <p className="text-sm text-muted-foreground">No audits yet.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Latest outreach</CardTitle>
            <CardDescription>Campaigns waiting for launch or follow-up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {campaign.tone} tone · {campaign.type.replaceAll('_', ' ')}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full capitalize">
                  {campaign.status}
                </Badge>
              </div>
            ))}
            {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">No campaigns yet.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Latest proposals</CardTitle>
            <CardDescription>Client offers that need follow-up or delivery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals.slice(0, 5).map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                <div>
                  <p className="font-medium">{proposal.title}</p>
                  <p className="text-sm text-muted-foreground">{proposal.clientName}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="rounded-full capitalize">
                    {proposal.status}
                  </Badge>
                  <p className="mt-2 text-sm font-medium">{proposal.totalValue ? formatCurrency(proposal.totalValue) : 'Custom quote'}</p>
                </div>
              </div>
            ))}
            {proposals.length === 0 ? <p className="text-sm text-muted-foreground">No proposals yet.</p> : null}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
