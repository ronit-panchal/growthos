import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSupabaseUser, deleteSupabaseUser, updateSupabaseUserPassword } from '@/lib/supabase-auth-http'
import { ROLE, canManageEmployees, isSuperAdmin, normalizeRole } from '@/lib/roles'
import { requireTenantContext } from '@/lib/tenant'

function deny() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function GET() {
  try {
    const tenant = await requireTenantContext()
    if (!canManageEmployees(tenant.role)) return deny()

    const where = isSuperAdmin(tenant.role)
      ? { role: { in: [ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.AGENCY_OWNER] } }
      : { managedById: tenant.userId }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    })
    return NextResponse.json({ users })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users.'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    if (!canManageEmployees(tenant.role)) return deny()
    const body = (await request.json()) as { name?: string; email?: string; password?: string; role?: string }

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'email and password are required.' }, { status: 400 })
    }
    if (body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const newRole = normalizeRole(body.role || ROLE.EMPLOYEE)
    if (newRole !== ROLE.EMPLOYEE && !(isSuperAdmin(tenant.role) && newRole === ROLE.ADMIN)) {
      return NextResponse.json({ error: 'Only superadmin can create admins.' }, { status: 403 })
    }

    const authUser = await createSupabaseUser({
      email: body.email,
      password: body.password,
      name: body.name || '',
      role: newRole,
      organizationId: tenant.organizationId,
    })

    const id = authUser.user?.id
    if (!id) {
      return NextResponse.json({ error: 'Auth user could not be created. Please verify Supabase service role permissions.' }, { status: 500 })
    }

    const user = await db.user.upsert({
      where: { id },
      create: {
        id,
        email: body.email.trim().toLowerCase(),
        name: body.name?.trim() || null,
        role: newRole,
        status: 'active',
        plan: 'free',
        managedById: tenant.userId,
      },
      update: {
        email: body.email.trim().toLowerCase(),
        name: body.name?.trim() || null,
        role: newRole,
        status: 'active',
        managedById: tenant.userId,
      },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user.'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    if (!canManageEmployees(tenant.role)) return deny()
    const body = (await request.json()) as { userId?: string; password?: string; status?: string }
    if (!body.userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 })

    const target = await db.user.findUnique({ where: { id: body.userId } })
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    if (!isSuperAdmin(tenant.role) && target.managedById !== tenant.userId) return deny()

    if (body.password) {
      await updateSupabaseUserPassword(body.userId, body.password)
    }

    if (body.status) {
      await db.user.update({
        where: { id: body.userId },
        data: { status: body.status === 'disabled' ? 'disabled' : 'active' },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user.'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    if (!canManageEmployees(tenant.role)) return deny()

    const userId = new URL(request.url).searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 })
    const target = await db.user.findUnique({ where: { id: userId } })
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    if (!isSuperAdmin(tenant.role) && target.managedById !== tenant.userId) return deny()
    if (normalizeRole(target.role) === ROLE.SUPERADMIN) return NextResponse.json({ error: 'Cannot delete superadmin.' }, { status: 403 })

    await deleteSupabaseUser(userId)
    await db.user.delete({ where: { id: userId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user.'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
