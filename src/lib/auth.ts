import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

type SupabaseTokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: {
    id: string
    email?: string
    user_metadata?: {
      name?: string
      full_name?: string
    }
    app_metadata?: {
      organization_id?: string
      role?: string
      plan?: string
    }
  }
}

async function signInWithSupabase(email: string, password: string): Promise<SupabaseTokenResponse | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as SupabaseTokenResponse
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const tokenPayload = await signInWithSupabase(email, password)
        if (!tokenPayload?.user?.id) {
          return null
        }

        const organizationId =
          tokenPayload.user.app_metadata?.organization_id?.trim() ||
          tokenPayload.user.id

        return {
          id: tokenPayload.user.id,
          email: tokenPayload.user.email ?? email,
          name: tokenPayload.user.user_metadata?.name ?? tokenPayload.user.user_metadata?.full_name ?? '',
          organizationId,
          role: tokenPayload.user.app_metadata?.role ?? 'member',
          plan: tokenPayload.user.app_metadata?.plan ?? 'free',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; organizationId?: string; role?: string; plan?: string }
        token.organizationId = u.organizationId?.trim() || u.id || token.sub || ''
        token.role = u.role ?? 'member'
        token.plan = u.plan ?? 'free'
      }

      if (!token.organizationId && token.sub) {
        token.organizationId = token.sub
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.organizationId =
          (typeof token.organizationId === 'string' && token.organizationId) || token.sub || ''
        session.user.role = typeof token.role === 'string' ? token.role : 'member'
        session.user.plan = typeof token.plan === 'string' ? token.plan : 'free'
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
