import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext } from '@/lib/tenant'
import { sendInviteEmail } from '@/lib/email'
import { isSmtpConfigured } from '@/lib/email-config'

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const body = (await request.json()) as { email?: string; inviterName?: string }

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          error: 'Email is not configured. Add SMTP_* variables to send invites.',
          code: 'EMAIL_NOT_CONFIGURED',
        },
        { status: 503 }
      )
    }

    const inviteToken = crypto.randomUUID()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const inviteLink = `${appUrl}/register?invite=${inviteToken}&org=${tenant.organizationId}`

    await sendInviteEmail(body.email.toLowerCase(), body.inviterName || 'Team admin', inviteLink)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send invite.'
    const status = message === 'Unauthorized' ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
