import { NextRequest, NextResponse } from 'next/server'
import { syncAppUser } from '@/lib/app-user'
import { supabaseServiceHeaders } from '@/lib/supabase-auth-http'

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

  const baseUrl = supabaseUrl.replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      ...supabaseServiceHeaders(supabaseAnonKey),
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

  const createdUser =
    (payload as { user?: { id?: string; email?: string; user_metadata?: { name?: string } } }).user ??
    (payload as {
      session?: { user?: { id?: string; email?: string; user_metadata?: { name?: string } } }
    }).session?.user

  if (createdUser?.id) {
    await syncAppUser({
      id: createdUser.id,
      email: createdUser.email?.trim().toLowerCase() || body.email.trim().toLowerCase(),
      name: createdUser.user_metadata?.name || body.name?.trim() || '',
    }).catch((error) => {
      console.error('Failed to sync app user after registration:', error)
    })
  }

  const hasSession =
    typeof payload.access_token === 'string' ||
    typeof (payload as { session?: { access_token?: string } }).session?.access_token === 'string'

  return NextResponse.json({
    ok: true,
    needsEmailConfirmation: !hasSession,
  })
}
