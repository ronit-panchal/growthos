import { db } from '@/lib/db'

type SyncAppUserInput = {
  id: string
  email: string
  name?: string | null
  role?: string | null
  plan?: string | null
}

const DEFAULT_TRIAL_LENGTH_DAYS = 14

export async function syncAppUser(input: SyncAppUserInput) {
  const id = input.id.trim()
  const email = input.email.trim().toLowerCase()
  const name = input.name?.trim() || null
  const role = input.role?.trim() || 'agency_owner'
  const plan = input.plan?.trim() || 'free'

  if (!id || !email) {
    throw new Error('App user sync requires a user id and email.')
  }

  const trialEndsAt = new Date(Date.now() + DEFAULT_TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000)

  const [user] = await Promise.all([
    db.user.upsert({
      where: { id },
      create: {
        id,
        email,
        name,
        role,
        plan,
        trialEndsAt,
      },
      update: {
        email,
        name: name ?? undefined,
        role,
        plan,
      },
    }),
    db.subscription.upsert({
      where: { userId: id },
      create: {
        userId: id,
        plan,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndsAt,
      },
      update: {
        plan,
      },
    }),
  ])

  return user
}
