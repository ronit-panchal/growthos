import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'
import { isRazorpayWebhookConfigured } from '@/lib/payments-config'
import { isSmtpConfigured } from '@/lib/email-config'

function verifyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) {
    return false
  }

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!isRazorpayWebhookConfigured()) {
    return NextResponse.json(
      { error: 'Webhooks disabled until RAZORPAY_WEBHOOK_SECRET is set.', code: 'WEBHOOK_NOT_CONFIGURED' },
      { status: 503 }
    )
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody) as {
    event?: string
    payload?: {
      payment?: {
        entity?: {
          id?: string
          amount?: number
          notes?: {
            email?: string
          }
        }
      }
    }
  }

  if (payload.event === 'payment.captured') {
    const payment = payload.payload?.payment?.entity
    if (payment?.notes?.email && payment.amount) {
      if (isSmtpConfigured()) {
        try {
          await sendInvoiceEmail(payment.notes.email, payment.amount / 100, payment.id || 'N/A')
        } catch (e) {
          console.error('[webhook] invoice email failed:', e)
        }
      } else {
        console.warn('[webhook] payment.captured: SMTP not configured, skipping invoice email')
      }
    }
  }

  return NextResponse.json({ ok: true })
}
