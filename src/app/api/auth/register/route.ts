import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Supabase auth environment variables are not configured.' },
      { status: 500 }
    )
  }

  const body = (await request.json()) as {
    email?: string
    password?: string
    name?: string
  }

  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      email: body.email.trim().toLowerCase(),
      password: body.password,
      data: {
        name: body.name?.trim() ?? '',
      },
    }),
  })

  const raw = await response.text()
  let payload: Record<string, unknown> = {}
  try {
    payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
  } catch {
    payload = {}
  }

  if (!response.ok) {
    const message =
      (typeof payload.msg === 'string' && payload.msg) ||
      (typeof payload.message === 'string' && payload.message) ||
      (typeof payload.error === 'string' && payload.error) ||
      (typeof payload.error_description === 'string' && payload.error_description) ||
      raw ||
      'Failed to create account.'
    return NextResponse.json({ error: String(message).trim() || 'Failed to create account.' }, { status: response.status })
  }

  return NextResponse.json({ ok: true })
}
