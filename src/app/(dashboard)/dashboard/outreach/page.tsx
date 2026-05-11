'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSearchParams, useRouter } from 'next/navigation'

export default function OutreachPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    tone: 'professional',
    industry: '',
    targetAudience: '',
    responseStyle: 'professional',
    responseLength: 'medium',
  })
  const [results, setResults] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setResults(null)

    try {
      const response = await fetch('/api/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone: formData.tone,
          industry: formData.industry || 'general',
          targetAudience: formData.targetAudience || 'business decision makers',
          responseStyle: formData.responseStyle,
          responseLength: formData.responseLength,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string; content?: unknown }
      if (!response.ok) throw new Error(payload.error || 'Failed to generate outreach content')

      setResults(payload.content)
      setMessage('Outreach content generated successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (action === 'new') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-fit rounded-full px-0 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl">Generate outreach</CardTitle>
              <CardDescription>Build campaign-ready messaging from industry, audience, and tone in a few clicks.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border bg-background px-3 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="assertive">Assertive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input name="industry" value={formData.industry} onChange={handleChange} placeholder="SaaS, design agency, logistics..." className="h-12 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target audience</label>
                  <Input name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Founders, CMOs, ecommerce operators..." className="h-12 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response style</label>
                  <select name="responseStyle" value={formData.responseStyle} onChange={handleChange} className="h-12 w-full rounded-2xl border bg-background px-3 text-sm">
                    <option value="professional">Professional</option>
                    <option value="formal">Formal</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response length</label>
                  <select name="responseLength" value={formData.responseLength} onChange={handleChange} className="h-12 w-full rounded-2xl border bg-background px-3 text-sm">
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>

                {message ? (
                  <div className={`rounded-3xl px-4 py-3 text-sm ${message.includes('successfully') ? 'bg-emerald-500/12 text-emerald-300' : 'bg-rose-500/12 text-rose-300'}`}>
                    {message}
                  </div>
                ) : null}

                <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl">
                  {loading ? 'Generating...' : 'Generate outreach'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>When to use it</CardTitle>
              <CardDescription>Pair outreach generation with your audits and proposals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-white/8 px-4 py-4">Generate a first-touch email right after adding a lead.</div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">Reference audit findings to make outreach feel specific and useful.</div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">Use the proposal module next when a reply shows buying intent.</div>
            </CardContent>
          </Card>
        </div>

        {results ? (
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Generated message</CardTitle>
              <CardDescription>Copy, adapt, and launch it inside your outbound workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Subject line</p>
                <p className="mt-2 font-medium">{results.subjectLine}</p>
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Email body</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{results.content}</p>
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">CTA</p>
                <p className="mt-2 font-medium">{results.cta}</p>
              </div>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  const email = `Subject: ${results.subjectLine}\n\n${results.content}\n\n${results.cta}`
                  navigator.clipboard.writeText(email)
                  setMessage('Outreach copied to clipboard.')
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy outreach
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-card/85 shadow-sm">
      <CardHeader>
        <CardTitle>Outreach workspace</CardTitle>
        <CardDescription>Generate a fresh campaign draft tailored to your ICP and offer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/dashboard/outreach?action=new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          <Megaphone className="h-4 w-4" />
          Create outreach
        </Link>
      </CardContent>
    </Card>
  )
}
