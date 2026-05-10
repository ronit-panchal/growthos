import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireTenantContext() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const organizationId = session.user.organizationId?.trim() || session.user.id

  return {
    userId: session.user.id,
    organizationId,
    role: session.user.role || 'member',
    plan: session.user.plan || 'free',
  }
}
