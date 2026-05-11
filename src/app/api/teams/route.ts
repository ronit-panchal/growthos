import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { canManageUsers } from '@/lib/roles'
import { requireTenantContext } from '@/lib/tenant'

export async function GET() {
  try {
    const tenant = await requireTenantContext()
    const members = await db.user.findMany({
      where: { managedById: tenant.userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    })
    return NextResponse.json({ members })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team members.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    if (!canManageUsers(tenant.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Use /api/admin/employees to create team members.' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add team member.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    if (!canManageUsers(tenant.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const memberId = new URL(request.url).searchParams.get('id')
    if (!memberId) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 })
    }
    const target = await db.user.findUnique({ where: { id: memberId } })
    if (!target || target.managedById !== tenant.userId) {
      return NextResponse.json({ error: 'Team member not found.' }, { status: 404 })
    }
    await db.user.delete({ where: { id: memberId } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove team member.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
