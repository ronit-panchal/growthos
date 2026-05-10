import Link from 'next/link'

const features = [
  {
    title: 'Lead & pipeline CRM',
    body: 'Store and progress leads via Prisma-backed APIs.',
  },
  {
    title: 'AI audits & outreach',
    body: 'Run audits and generate outreach when your AI credentials are wired.',
  },
  {
    title: 'Teams & isolation',
    body: 'JWT sessions with workspace scoping ready for multi-tenant rules.',
  },
  {
    title: 'Billing when you need it',
    body: 'Razorpay checkout and webhooks activate only after you add keys.',
  },
]

export default function MarketingHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-medium text-primary">GrowthOS for agencies</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
            One workspace for pipeline, audits, and outreach.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Ship a serious SaaS foundation: authenticated app shell, Postgres data layer, optional payments, and APIs
            you can extend without ripping out demo cruft.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Create account
            </Link>
            <Link href="/pricing" className="rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted/50">
              See pricing
            </Link>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Production-minded defaults</h2>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            <li>NextAuth credentials via Supabase—no toy single-user mode.</li>
            <li>PostgreSQL via Prisma; no SQLite in production.</li>
            <li>Optional Razorpay: APIs return explicit “not configured” until you enable billing.</li>
          </ul>
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight">What you get</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((item) => (
            <article key={item.title} className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-24 rounded-xl border bg-muted/30 px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Ready to run your workspace?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Sign up and connect Postgres + Supabase. Add payments when you&apos;re ready to charge.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Get started
        </Link>
      </section>
    </main>
  )
}
