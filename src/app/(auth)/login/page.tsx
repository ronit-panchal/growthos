'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = '/dashboard'

  const notice = useMemo(() => {
    if (searchParams.get('checkEmail') === '1') {
      const targetEmail = searchParams.get('email')
      return targetEmail
        ? `Verification sent to ${targetEmail}. Confirm your email link, then sign in from any device.`
        : 'Check your email and verify your account, then sign in.'
    }
    if (searchParams.get('welcome') === '1') {
      return 'Account created successfully. Sign in to open your workspace.'
    }
    return ''
  }, [searchParams])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const sessionRes = await fetch('/api/auth/password-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const sessionPayload = (await sessionRes.json().catch(() => ({}))) as {
        accessToken?: string
        error?: string
      }

      if (!sessionRes.ok || !sessionPayload.accessToken) {
        const msg =
          sessionPayload.error ||
          'Could not sign in. Check your email and password, or ask your admin to reset your password.'
        setError(msg)
        toast.error(msg)
        return
      }

      const result = await signIn('supabase-access-token', {
        accessToken: sessionPayload.accessToken,
        redirect: false,
        callbackUrl,
      })

      if (!result || result.error) {
        const message =
          result?.error === 'CredentialsSignin'
            ? 'Session could not be created. Check NEXTAUTH_SECRET and Supabase keys, or contact support.'
            : (result?.error ?? 'Could not start app session.')
        setError(message)
        toast.error(message)
        return
      }

      toast.success('Signed in successfully.')
      await fetch('/api/auth/session-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'login', metadata: { source: 'login-page' } }),
      }).catch(() => null)
      router.push(result.url ?? callbackUrl)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Sign-in failed unexpectedly.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Secure workspace access</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Sign in to manage leads, audits, outreach, and proposals in one place.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          GrowthOS keeps your front-of-funnel and close-the-deal workflow connected, with email verification-aware login and protected workspace data.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 font-medium">Protected workspace</p>
            <p className="mt-2 text-sm text-muted-foreground">Authenticated sessions and scoped API access keep each account isolated.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="mt-3 font-medium">Verification friendly</p>
            <p className="mt-2 text-sm text-muted-foreground">Users can confirm email on any device and then log in when they are ready.</p>
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-card/90 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div>
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Open your GrowthOS workspace</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Owners and employees use this same form. If your admin created your employee account, you do not need an email verification link—sign in with the password they set (or reset).
            </p>
          </div>

          {notice ? (
            <div className="mt-6 rounded-3xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-foreground">
              {notice}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Work email</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 rounded-2xl"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl text-sm font-medium">
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-transparent" />}>
      <LoginPageContent />
    </Suspense>
  )
}
