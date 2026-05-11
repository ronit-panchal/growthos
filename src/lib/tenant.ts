import { getServerSession } from 'next-auth'
import { syncAppUser } from '@/lib/app-user'
import { authOptions } from '@/lib/auth'
import { normalizeRole } from '@/lib/roles'

export async function requireTenantContext() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const fallbackEmail = `${session.user.id}@local.growthos`
  const email = session.user.email?.trim().toLowerCase() || fallbackEmail

  try {
    await syncAppUser({
      id: session.user.id,
      email,
      name: session.user.name,
      role: session.user.role,
      plan: session.user.plan,
    })
  } catch (error) {
    console.error('Failed to sync tenant context user:', error)
  }

  const organizationId = session.user.organizationId?.trim() || session.user.id

  return {
    userId: session.user.id,
    email,
    organizationId,
    role: session.user.role || 'member',
    roleNormalized: normalizeRole(session.user.role || 'member'),
    plan: session.user.plan || 'free',
  }
}
