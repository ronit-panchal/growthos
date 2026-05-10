const plans = [
  { name: 'Starter', price: 'INR 1,999/mo', blurb: 'For solo operators launching outbound.' },
  { name: 'Pro', price: 'INR 6,999/mo', blurb: 'For growing teams that need automation and limits.' },
  { name: 'Scale', price: 'INR 14,999/mo', blurb: 'For multi-brand orgs with advanced controls.' },
]

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Simple, usage-based pricing</h1>
      <p className="mt-2 text-muted-foreground">Choose a plan and upgrade as your pipeline grows.</p>
      <p className="mt-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Checkout is powered by Razorpay. Until you configure{' '}
        <code className="rounded bg-background px-1 font-mono text-xs">RAZORPAY_KEY_ID</code> and{' '}
        <code className="rounded bg-background px-1 font-mono text-xs">RAZORPAY_KEY_SECRET</code>, the billing API returns
        a clear &quot;billing not configured&quot; response—safe to ship the repo without collecting payments yet.
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-medium">{plan.name}</h2>
            <p className="mt-2 text-2xl font-semibold">{plan.price}</p>
            <p className="mt-3 text-sm text-muted-foreground">{plan.blurb}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
