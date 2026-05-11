import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTenantContext } from '@/lib/tenant'

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const body = (await request.json()) as { eventType?: string; metadata?: Record<string, unknown> }
    const eventType = body.eventType === 'logout' ? 'logout' : 'login'

    await db.authEvent.create({
      data: {
        userId: tenant.userId,
        eventType,
        actorRole: tenant.role,
        actorEmail: tenant.email,
        ipAddress: getClientIp(request),
        userAgent: request.headers.get('user-agent'),
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save auth event.'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

