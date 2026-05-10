import { createClient } from '@supabase/supabase-js'

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.')
  }

  return { url, anonKey }
}

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv()
  return createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
}

export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv()
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
