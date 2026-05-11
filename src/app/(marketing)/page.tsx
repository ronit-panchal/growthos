import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Megaphone, SearchCheck, ShieldCheck, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const pillars = [
  {
    icon: Target,
    title: 'Capture revenue opportunities',
    body: 'Create a structured lead pipeline with score, stage, source, value, and the context your team needs to act quickly.',
  },
  {
    icon: SearchCheck,
    title: 'Turn audits into trust',
    body: 'Run website audits that highlight SEO, UX, performance, and accessibility gaps so your sales pitch starts with proof.',
  },
  {
    icon: Megaphone,
    title: 'Generate outreach faster',
    body: 'Produce outreach drafts for cold email, follow-up, and LinkedIn without switching between chat tools and spreadsheets.',
  },
  {
    icon: FileText,
    title: 'Move from interest to proposal',
    body: 'Package scope, pricing, and recommendations into proposals that feel like the next step instead of another separate workflow.',
  },
]

const workflow = [
  'A visitor becomes a lead.',
  'You run an audit or qualify the opportunity.',
  'GrowthOS helps your team prepare outreach and a proposal.',
  'You track deal momentum in one dashboard instead of scattered tools.',
]

const trustPoints = [
  'Email verification-compatible sign-up flow via Supabase Auth.',
  'Workspace-scoped session protection for app data.',
  'Postgres + Prisma data model ready for real customer records.',
  'Billing can stay disabled safely until you add Razorpay keys.',
]

export default function MarketingHomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
        <div>
          <Badge variant="outline" className="rounded-full border-primary/30 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.2em]">
            Built for agencies and growth teams
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Turn leads, audits, outreach, and proposals into one sellable operating system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            GrowthOS gives your agency a modern SaaS front door and a delivery-ready workspace behind it, so new users understand the value, choose a plan, verify email, log in, and start working without confusion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-5 py-3 text-sm font-medium transition hover:bg-background"
            >
              Explore plans
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-background/65 px-4 py-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-white/10 bg-card/85 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(14,165,233,0.12))] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">How GrowthOS works</p>
              <div className="mt-6 space-y-4">
                {workflow.map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/85 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-background/75 px-4 py-4">
                <p className="text-sm text-muted-foreground">Best for</p>
                <p className="mt-2 font-medium">Agencies, consultants, outbound teams</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-background/75 px-4 py-4">
                <p className="text-sm text-muted-foreground">Launch mode</p>
                <p className="mt-2 font-medium">Free beta until billing keys are added</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-background/75 px-4 py-4">
                <p className="text-sm text-muted-foreground">Access</p>
                <p className="mt-2 font-medium">Email verification + protected dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <Card key={pillar.title} className="border-white/10 bg-card/80 shadow-sm">
                <CardContent className="p-6">
                  <span className="inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.body}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[32px] border border-white/10 bg-card/80 p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_.9fr]">
            <div>
              <p className="text-sm font-medium text-primary">Why buyers understand it quickly</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">A public story and a private engine.</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                The marketing side explains the outcome. The dashboard proves the workflow. Together they make GrowthOS feel like a real business product instead of a stack of disconnected tools.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
                <p className="font-medium">Before purchase</p>
                <p className="mt-2 text-sm text-muted-foreground">Clear positioning, plan comparison, and a low-friction entry point.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
                <p className="font-medium">After purchase</p>
                <p className="mt-2 text-sm text-muted-foreground">Workspace analytics, lead capture, audits, outreach, proposals, and owner oversight.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
