'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
      let payload: { error?: string; ok?: boolean } = {}
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

      toast.success('Account created. Sign in with your email and password.')
      router.push('/login')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Network error. Check your connection.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start using GrowthOS with your team.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary underline-offset-2 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
