import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isProvisionedAuthUser } from '@/lib/roles'
import {
  confirmSupabaseUserEmailById,
  signInWithPasswordGrant,
} from '@/lib/supabase-auth-http'

function looksLikeUnconfirmedEmailError(error: string, code?: string) {
  const e = error.toLowerCase()
  if (code === 'email_not_confirmed') return true
  return (
    e.includes('email not confirmed') ||
    e.includes('not confirmed') ||
    e.includes('email_not_confirmed') ||
    e.includes('confirm your email')
  )
}

/**
 * Server-side password login. Retries once after confirming email for admin-provisioned users
 * (employees / managed accounts) so they never depend on an inbox verification link.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    let grant = await signInWithPasswordGrant(email, password)

    if (!grant.ok && looksLikeUnconfirmedEmailError(grant.error, grant.code)) {
      const appUser = await db.user.findFirst({
        where: { email },
        select: { id: true, role: true, managedById: true },
      })

      if (appUser && isProvisionedAuthUser(appUser.role, appUser.managedById)) {
        try {
          await confirmSupabaseUserEmailById(appUser.id)
          grant = await signInWithPasswordGrant(email, password)
        } catch (confirmError) {
          console.error('confirmSupabaseUserEmailById failed:', confirmError)
        }
      }
    }

    if (!grant.ok) {
      return NextResponse.json({ error: grant.error }, { status: 401 })
    }

    return NextResponse.json({ accessToken: grant.access_token })
  } catch (error) {
    console.error('password-session error:', error)
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 })
  }
}
