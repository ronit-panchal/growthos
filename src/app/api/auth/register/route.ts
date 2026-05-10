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

  const payload = (await response.json()) as { msg?: string; error_description?: string }

  if (!response.ok) {
    return NextResponse.json(
      { error: payload.msg ?? payload.error_description ?? 'Failed to create account.' },
      { status: response.status }
    )
  }

  return NextResponse.json({ ok: true })
}
