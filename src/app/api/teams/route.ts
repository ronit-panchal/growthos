import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { assertWithinPlanLimit } from '@/lib/plan-limits'
import { getUsage, incrementUsage } from '@/lib/usage-tracker'
import { requireTenantContext } from '@/lib/tenant'

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
}

const teamStore = new Map<string, TeamMember[]>()

export async function GET() {
  try {
    const tenant = await requireTenantContext()
    return NextResponse.json({ members: teamStore.get(tenant.organizationId) || [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team members.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const body = (await request.json()) as { name?: string; email?: string; role?: string }

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const usage = getUsage(tenant.organizationId)
    assertWithinPlanLimit(tenant.plan as 'free' | 'starter' | 'pro' | 'enterprise', usage)

    const member: TeamMember = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email.toLowerCase(),
      role: body.role || 'member',
    }

    const list = teamStore.get(tenant.organizationId) || []
    list.push(member)
    teamStore.set(tenant.organizationId, list)
    incrementUsage(tenant.organizationId, 'members', 1)

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add team member.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const memberId = new URL(request.url).searchParams.get('id')
    if (!memberId) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 })
    }

    const list = teamStore.get(tenant.organizationId) || []
    teamStore.set(
      tenant.organizationId,
      list.filter((member) => member.id !== memberId)
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove team member.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
