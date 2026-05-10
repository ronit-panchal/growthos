import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Your account is secured and scoped to your workspace. Product modules for leads, audits, outreach, and
          proposals integrate through the REST API under{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/*</code> — use{' '}
          <span className="font-medium text-foreground">PostgreSQL via Prisma</span> as the source of truth.
        </p>
      </div>
      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
        <li>Use the documented API routes with your authenticated session.</li>
        <li>Billing endpoints return 503 until Razorpay keys are set (optional).</li>
        <li>Team invites require SMTP configured in production.</li>
      </ul>
    </section>
  )
}
