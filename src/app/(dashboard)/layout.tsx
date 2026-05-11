import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LineChart,
  Megaphone,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { UserProfileMenu } from '@/components/user-profile-menu'

const ADMIN_ROLES = new Set(['admin', 'agency_owner', 'super_admin', 'superadmin', 'developer'])

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const isPersonalWorkspace = session.user.organizationId === session.user.id
  const workspaceLabel = isPersonalWorkspace ? 'Personal workspace' : 'Organization'
  const isOwner = ADMIN_ROLES.has(session.user.role || '')
  const planLabel = (session.user.plan || 'free').replace(/^\w/, (value) => value.toUpperCase())
  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/leads?action=new', label: 'Leads', icon: LineChart },
    { href: '/dashboard/audits?action=new', label: 'Audits', icon: SearchCheck },
    { href: '/dashboard/outreach?action=new', label: 'Outreach', icon: Megaphone },
    { href: '/dashboard/proposals?action=new', label: 'Proposals', icon: FileText },
    { href: '/pricing', label: 'Pricing', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_24%)]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4 rounded-[28px] border border-white/10 bg-card/85 p-5 shadow-sm backdrop-blur">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.22em] text-primary uppercase"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                G
              </span>
              GrowthOS
            </Link>

            <div className="mt-6 rounded-3xl border border-white/10 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{workspaceLabel}</p>
              <p className="mt-2 truncate text-sm font-medium">
                {isPersonalWorkspace ? session.user.email ?? 'Private workspace' : session.user.organizationId}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {planLabel} plan
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 capitalize">
                  {session.user.role || 'member'}
                </Badge>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-primary/8 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
              {isOwner ? (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/6 px-3 py-2.5 text-sm text-foreground transition hover:bg-primary/10"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Hidden owner admin
                </Link>
              ) : null}
            </nav>

            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-sky-500/10 p-4 text-sm">
              <p className="font-medium">Operate like a productized agency</p>
              <p className="mt-2 text-muted-foreground">
                Capture leads, audit client websites, generate proposals, and keep your team in one operating system.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="rounded-[28px] border border-white/10 bg-card/85 px-5 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Agency Operating System</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  Drive pipeline, delivery, and follow-up from one workspace.
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <UserProfileMenu user={{
                  id: session.user.id,
                  name: session.user.name ?? null,
                  email: session.user.email ?? '',
                  image: null,
                  plan: session.user.plan || 'free',
                  role: session.user.role || 'member'
                }} />
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-sm font-medium text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
              {isOwner ? (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary/6 px-3 py-2 text-sm font-medium"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Admin
                </Link>
              ) : null}
            </div>
          </header>

          <main className="mt-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
