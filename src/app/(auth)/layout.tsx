import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute left-6 top-6 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← GrowthOS
      </Link>
      {children}
    </div>
  )
}
