import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Activity, CreditCard, ShieldCheck, Users } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmployeeManager } from '@/components/admin/employee-manager'
import { canManageEmployees } from '@/lib/roles'

const ADMIN_ROLES = new Set(['admin', 'agency_owner', 'super_admin', 'superadmin', 'developer'])

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role || 'member'

  if (!session?.user?.id || !ADMIN_ROLES.has(role)) {
    notFound()
  }

  const [users, leads, audits, proposals, campaigns, subscriptions, recentUsers, recentActivities, authEvents] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, plan: true, createdAt: true, trialEndsAt: true },
    }),
    db.lead.findMany({ select: { status: true, value: true } }),
    db.auditJob.findMany({ select: { status: true, overallScore: true } }),
    db.proposal.findMany({ select: { status: true, totalValue: true, createdAt: true } }),
    db.outreachCampaign.findMany({ select: { status: true } }),
    db.subscription.findMany({ select: { plan: true, status: true } }),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, email: true, role: true, plan: true, createdAt: true },
    }),
    db.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, title: true, description: true, createdAt: true },
    }),
    db.authEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: 10,
      select: { id: true, eventType: true, actorEmail: true, actorRole: true, occurredAt: true },
    }),
  ])

  const openPipelineValue = leads
    .filter((lead) => !['won', 'lost'].includes(lead.status))
    .reduce((sum, lead) => sum + lead.value, 0)
  const acceptedRevenue = proposals
    .filter((proposal) => proposal.status === 'accepted')
    .reduce((sum, proposal) => sum + proposal.totalValue, 0)
  const completedAuditScores = audits.filter((audit) => typeof audit.overallScore === 'number').map((audit) => audit.overallScore || 0)
  const averageAuditScore = completedAuditScores.length
    ? Math.round(completedAuditScores.reduce((sum, score) => sum + score, 0) / completedAuditScores.length)
    : 0

  const planDistribution = users.reduce<Record<string, number>>((accumulator, user) => {
    accumulator[user.plan] = (accumulator[user.plan] || 0) + 1
    return accumulator
  }, {})

  const subscriptionHealth = subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
    accumulator[subscription.status] = (accumulator[subscription.status] || 0) + 1
    return accumulator
  }, {})

  const statCards = [
    {
      title: 'Platform users',
      value: users.length.toString(),
      caption: `${users.filter((user) => user.role !== 'team_member').length} owners/admins`,
      icon: Users,
    },
    {
      title: 'Open pipeline',
      value: formatCurrency(openPipelineValue),
      caption: `${leads.length} total leads captured`,
      icon: Activity,
    },
    {
      title: 'Accepted revenue',
      value: formatCurrency(acceptedRevenue),
      caption: `${proposals.filter((proposal) => proposal.status === 'accepted').length} accepted proposals`,
      icon: CreditCard,
    },
    {
      title: 'Audit quality',
      value: `${averageAuditScore}/100`,
      caption: `${audits.filter((audit) => audit.status === 'completed').length} completed audits`,
      icon: ShieldCheck,
    },
  ]

  return (
    <section className="space-y-6">
      <Card className="border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(14,165,233,0.1))] shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <Badge variant="outline" className="rounded-full border-primary/30 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em]">
            Hidden owner route
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">GrowthOS admin control room</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            This page is intentionally private to agency owners and admins. Use it to monitor adoption, plan mix, activity velocity, and overall product health before you open the app to more customers.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-white/10 bg-card/85 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardDescription>{card.title}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">{card.value}</CardTitle>
                </div>
                <span className="rounded-2xl bg-primary/12 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.caption}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
            <CardDescription>How accounts are split across plans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(planDistribution).length === 0 ? (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            ) : (
              Object.entries(planDistribution).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                  <span className="capitalize">{plan}</span>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {count}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Subscription health</CardTitle>
            <CardDescription>Current billing state across tracked subscriptions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {Object.entries(subscriptionHealth).length === 0 ? (
              <p className="text-sm text-muted-foreground">Subscriptions will appear here after billing is enabled.</p>
            ) : (
              Object.entries(subscriptionHealth).map(([status, count]) => (
                <div key={status} className="rounded-3xl border border-white/8 px-4 py-4">
                  <p className="text-sm capitalize text-muted-foreground">{status}</p>
                  <p className="mt-2 text-2xl font-semibold">{count}</p>
                </div>
              ))
            )}
            <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/6 px-4 py-4 md:col-span-2">
              <p className="font-medium">Billing is still in safe mode.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Razorpay routes are implemented, but checkout stays inactive until you add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Newest accounts</CardTitle>
            <CardDescription>The most recent users to land in the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full capitalize">
                    {user.plan}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>Operational feed</CardTitle>
            <CardDescription>Everything the platform has done most recently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="rounded-3xl border border-white/8 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {activity.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {activity.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-card/85 shadow-sm">
        <CardHeader>
          <CardTitle>Launch readiness checklist</CardTitle>
          <CardDescription>What is already present and what still needs your keys or settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/8 px-4 py-4">
            <p className="font-medium">Ready now</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Marketing pages, plan selection, account creation, email-confirmation-aware login flow, protected dashboard, proposals, outreach, and audits.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 px-4 py-4">
            <p className="font-medium">Needs config</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Billing requires Razorpay keys. Confirmation links require the correct Supabase Site URL and redirect allowlist for your Vercel domain.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 px-4 py-4">
            <p className="font-medium">Still improvable later</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Team management and usage tracking are still memory-based helpers rather than full relational models, so they should be upgraded before a larger rollout.
            </p>
          </div>
        </CardContent>
      </Card>

      {canManageEmployees(role) ? (
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>User and employee access</CardTitle>
            <CardDescription>
              Admin and superadmin can create/remove employees. Employees cannot manage users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeManager />
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-card/85 shadow-sm">
        <CardHeader>
          <CardTitle>Login and logout audit</CardTitle>
          <CardDescription>Track who entered the platform and when they signed out.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {authEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-3">
              <div>
                <p className="font-medium">
                  {(event.actorEmail || 'Unknown user')} {event.eventType === 'login' ? 'logged in' : 'logged out'}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{event.actorRole || 'unknown role'}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.occurredAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          {authEvents.length === 0 ? <p className="text-sm text-muted-foreground">No auth events yet.</p> : null}
        </CardContent>
      </Card>
    </section>
  )
}
