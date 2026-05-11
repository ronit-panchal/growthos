/**
 * Shared headers for Supabase GoTrue REST calls from the server.
 * Some projects require both `apikey` and `Authorization: Bearer <anon>`.
 */
export function supabaseServiceHeaders(anonKey: string) {
  return {
    'Content-Type': 'application/json',
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  } as const
}

function supabaseAdminHeaders(serviceRoleKey: string) {
  return {
    'Content-Type': 'application/json',
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  } as const
}

/** Decode Supabase JWT payload without verifying signature (used only to recover claims NextAuth needs). */
export function decodeSupabaseAccessToken(accessToken: string): {
  sub?: string
  email?: string
  user_metadata?: { name?: string; full_name?: string }
  app_metadata?: { organization_id?: string; role?: string; plan?: string }
} | null {
  try {
    const segment = accessToken.split('.')[1]
    if (!segment) return null
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(padded, 'base64').toString('utf8')
        : ''
    if (!json) return null
    return JSON.parse(json) as {
      sub?: string
      email?: string
      user_metadata?: { name?: string; full_name?: string }
      app_metadata?: { organization_id?: string; role?: string; plan?: string }
    }
  } catch {
    return null
  }
}

export async function fetchSupabaseUser(accessToken: string): Promise<{
  id: string
  email?: string
  user_metadata?: { name?: string; full_name?: string }
  app_metadata?: { organization_id?: string; role?: string; plan?: string }
} | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  const res = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: anonKey,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return (await res.json()) as {
    id: string
    email?: string
    user_metadata?: { name?: string; full_name?: string }
    app_metadata?: { organization_id?: string; role?: string; plan?: string }
  }
}

export type PasswordGrantResult =
  | { ok: true; access_token: string }
  | { ok: false; error: string; code?: string }

/** Password login via GoTrue REST (same as supabase-js signInWithPassword). */
export async function signInWithPasswordGrant(email: string, password: string): Promise<PasswordGrantResult> {
  const url = getSupabaseBaseUrl()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!anonKey) {
    return { ok: false, error: 'Supabase anon key is not configured.' }
  }

  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: supabaseServiceHeaders(anonKey),
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
    cache: 'no-store',
  })

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string
    error?: string
    error_description?: string
    msg?: string
    message?: string
    error_code?: string
  }

  if (!res.ok || !data.access_token) {
    const message =
      data.error_description ||
      data.msg ||
      data.message ||
      data.error ||
      'Invalid email or password.'
    const code = data.error_code || data.error
    return { ok: false, error: message, code }
  }

  return { ok: true, access_token: data.access_token }
}

/** Mark auth user as confirmed (no inbox email required). */
export async function confirmSupabaseUserEmailById(userId: string) {
  const baseUrl = getSupabaseBaseUrl()
  const adminHeaders = supabaseAdminHeaders(getServiceRoleKey())
  const res = await fetch(`${baseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      email_confirm: true,
    }),
  })
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { msg?: string; message?: string; error?: string }
    throw new Error(payload.msg || payload.message || payload.error || 'Could not confirm user email.')
  }
}

function getSupabaseBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.')
  }
  return url
}

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.')
  }
  return key
}

export async function createSupabaseUser(input: {
  email: string
  password: string
  name?: string
  role: string
  organizationId: string
}) {
  const baseUrl = getSupabaseBaseUrl()
  const adminHeaders = supabaseAdminHeaders(getServiceRoleKey())

  const res = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      email_confirm: true,
      user_metadata: { name: input.name || '' },
      app_metadata: { role: input.role, organization_id: input.organizationId },
    }),
  })

  const payload = (await res.json().catch(() => ({}))) as {
    id?: string
    email?: string
    user?: { id?: string; email?: string }
    msg?: string
    message?: string
    error?: string
  }
  if (!res.ok) {
    throw new Error(payload.msg || payload.message || payload.error || 'Unable to create auth user.')
  }
  const userId = payload.user?.id || payload.id
  const userEmail = payload.user?.email || payload.email || input.email.trim().toLowerCase()

  if (!userId) {
    throw new Error('Supabase returned no user id for the created account.')
  }

  // Ensure account is fully login-ready and metadata is persisted.
  const finalizeRes = await fetch(`${baseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      password: input.password,
      email_confirm: true,
      user_metadata: { name: input.name || '' },
      app_metadata: { role: input.role, organization_id: input.organizationId, plan: 'free' },
    }),
  })

  if (!finalizeRes.ok) {
    const finalizePayload = (await finalizeRes.json().catch(() => ({}))) as {
      msg?: string
      message?: string
      error?: string
    }
    throw new Error(
      finalizePayload.msg || finalizePayload.message || finalizePayload.error || 'Created user but failed to finalize account.'
    )
  }

  return {
    user: {
      id: userId,
      email: userEmail,
    },
  }
}

export async function updateSupabaseUserPassword(userId: string, password: string) {
  const res = await fetch(`${getSupabaseBaseUrl()}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: supabaseAdminHeaders(getServiceRoleKey()),
    body: JSON.stringify({ password }),
  })
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((payload as { msg?: string }).msg || 'Unable to update password.')
}

export async function deleteSupabaseUser(userId: string) {
  const res = await fetch(`${getSupabaseBaseUrl()}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: supabaseAdminHeaders(getServiceRoleKey()),
  })
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}))
    throw new Error((payload as { msg?: string }).msg || 'Unable to delete auth user.')
  }
}
