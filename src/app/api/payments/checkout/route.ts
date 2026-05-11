import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext } from '@/lib/tenant'
import { getRazorpayClient } from '@/lib/razorpay'
import { isRazorpayCheckoutConfigured } from '@/lib/payments-config'

const PLAN_PRICING_INR: Record<string, number> = {
  starter: 199900,
  pro: 699900,
  scale: 1499900,
}

export async function POST(request: NextRequest) {
  try {
    if (!isRazorpayCheckoutConfigured()) {
      return NextResponse.json(
        {
          error: 'Billing is not configured. Add Razorpay keys when you are ready to charge.',
          code: 'BILLING_NOT_CONFIGURED',
        },
        { status: 503 }
      )
    }

    const tenant = await requireTenantContext()
    const body = (await request.json()) as { plan?: string }
    const plan = (body.plan || '').toLowerCase()
    const amount = PLAN_PRICING_INR[plan]

    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
    }

    const razorpay = getRazorpayClient()
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      notes: {
        plan,
        email: tenant.email,
        organizationId: tenant.organizationId,
        userId: tenant.userId,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout order.'
    let status = 500
    if (message === 'Unauthorized') status = 401
    if (message === 'Razorpay credentials are not configured.') status = 503
    return NextResponse.json({ error: message }, { status })
  }
}
