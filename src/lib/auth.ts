import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { syncAppUser } from '@/lib/app-user'
import { decodeSupabaseAccessToken, fetchSupabaseUser } from '@/lib/supabase-auth-http'
import { db } from '@/lib/db'
import { normalizeRole } from '@/lib/roles'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'supabase-access-token',
      name: 'Supabase session',
      credentials: {
        /** Short-lived JWT from supabase-js signInWithPassword (client) */
        accessToken: { label: 'Access token', type: 'text' },
      },
      async authorize(credentials) {
        const accessToken =
          typeof credentials?.accessToken === 'string' ? credentials.accessToken.trim() : ''

        if (!accessToken) {
          return null
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) {
          return null
        }

        const profile = await fetchSupabaseUser(accessToken)
        const claims = decodeSupabaseAccessToken(accessToken)

        const userId = profile?.id || claims?.sub || ''
        const email =
          profile?.email?.trim().toLowerCase() ||
          claims?.email?.trim().toLowerCase() ||
          ''

        if (!userId || !email) {
          return null
        }

        const organizationId =
          profile?.app_metadata?.organization_id?.trim() ||
          claims?.app_metadata?.organization_id?.trim() ||
          userId
        const name =
          profile?.user_metadata?.name ??
          profile?.user_metadata?.full_name ??
          claims?.user_metadata?.name ??
          claims?.user_metadata?.full_name ??
          ''
        const role = normalizeRole(
          profile?.app_metadata?.role ?? claims?.app_metadata?.role ?? 'agency_owner'
        )
        const plan = profile?.app_metadata?.plan ?? claims?.app_metadata?.plan ?? 'free'

        try {
          await syncAppUser({
            id: userId,
            email,
            name,
            role,
            plan,
          })
        } catch (error) {
          console.error('Failed to sync app user during sign-in:', error)
        }

        const appUser = await db.user.findUnique({ where: { id: userId } }).catch(() => null)
        if (appUser?.status === 'disabled') {
          return null
        }

        return {
          id: userId,
          email,
          name,
          organizationId,
          role,
          plan,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; organizationId?: string; role?: string; plan?: string }
        token.organizationId = u.organizationId?.trim() || u.id || token.sub || ''
        token.role = normalizeRole(u.role ?? 'member')
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
        session.user.email =
          session.user.email || (typeof token.email === 'string' ? token.email : '')
        session.user.name =
          session.user.name || (typeof token.name === 'string' ? token.name : '')
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
