import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_25%),linear-gradient(180deg,rgba(248,250,252,1),rgba(240,253,250,0.8))] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_20%),linear-gradient(180deg,rgba(12,15,20,1),rgba(10,14,18,1))]">
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur transition hover:text-foreground"
      >
        Back to GrowthOS
      </Link>
      {children}
    </div>
  )
}
