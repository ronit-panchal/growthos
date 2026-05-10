import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { SignOutButton } from '@/components/sign-out-button'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const isPersonalWorkspace = session.user.organizationId === session.user.id
  const workspaceLabel = isPersonalWorkspace ? 'Personal workspace' : 'Organization'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">{workspaceLabel}</p>
            <p className="font-mono text-xs font-medium sm:text-sm truncate max-w-[min(100%,20rem)]">
              {isPersonalWorkspace ? session.user.email ?? '—' : session.user.organizationId}
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
