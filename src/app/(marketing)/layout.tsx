import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,rgba(248,250,252,1),rgba(240,253,250,0.65))] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_22%),linear-gradient(180deg,rgba(12,15,20,1),rgba(10,14,18,1))]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">G</span>
            <span>
              <span className="block text-xs uppercase tracking-[0.24em] text-muted-foreground">GrowthOS</span>
              <span className="block text-sm">Agency revenue operating system</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/pricing" className="text-muted-foreground transition hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground transition hover:text-foreground">
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Start free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
