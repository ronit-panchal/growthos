'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const text = await response.text()
      let payload: { error?: string; ok?: boolean; needsEmailConfirmation?: boolean } = {}
      try {
        payload = text ? (JSON.parse(text) as typeof payload) : {}
      } catch {
        toast.error(text || 'Something went wrong. Please try again.')
        setError(text || 'Invalid response from server.')
        return
      }

      if (!response.ok) {
        const message = payload.error ?? `Could not sign up (${response.status}).`
        setError(message)
        toast.error(message)
        return
      }

      if (payload.needsEmailConfirmation) {
        toast.success('Check your email and confirm your account before signing in.')
        router.push(`/login?checkEmail=1&email=${encodeURIComponent(email.trim().toLowerCase())}`)
      } else {
        toast.success('Account created. You can sign in now.')
        router.push('/login?welcome=1')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Network error. Check your connection.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Create your workspace</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Start using GrowthOS as the operating system behind your agency growth.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A new account gives you a protected workspace for lead management, audits, outreach, proposals, and owner visibility into the whole pipeline.
        </p>
        <div className="mt-8 space-y-3">
          <div className="flex items-start gap-3 rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email verification support</p>
              <p className="mt-1 text-sm text-muted-foreground">If confirmation is enabled in Supabase, users can verify from any device and then sign in safely.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-3xl border border-white/10 bg-background/70 px-4 py-4">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Launch-ready workflow</p>
              <p className="mt-1 text-sm text-muted-foreground">Get immediate access to the workspace after signup, with pricing and billing mode handled separately.</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-card/90 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div>
            <p className="text-sm font-medium text-primary">Account setup</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create your GrowthOS login</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your email becomes the identity for verification, sign-in, and workspace ownership.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Alex Morgan"
                className="h-12 rounded-2xl"
              />
            </div>
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
                minLength={8}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="h-12 rounded-2xl"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl text-sm font-medium">
              {loading ? 'Creating account...' : 'Create account'}
              {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
