'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, SearchCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type AuditResponse = {
  overallScore?: number
  seoScore?: number
  uxScore?: number
  performance?: number
  performanceScore?: number
  findings?: Array<{ category?: string; severity?: string; issue?: string; title?: string; description?: string }>
  suggestions?: Array<string | { title?: string; description?: string; impact?: string }>
}

export default function AuditsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [responseStyle, setResponseStyle] = useState<'professional' | 'formal' | 'advanced'>('professional')
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [results, setResults] = useState<AuditResponse | null>(null)

  const readError = async (response: Response) => {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    return payload.error || `Request failed (${response.status})`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setResults(null)

    try {
      if (!url) throw new Error('Please enter a website URL.')

      const createRes = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!createRes.ok) throw new Error(await readError(createRes))
      const auditData = (await createRes.json()) as { audit?: { id?: string } }
      const auditId = auditData.audit?.id

      if (!auditId) throw new Error('Audit record was created without an id.')

      setMessage('Audit started. GrowthOS is analyzing the site now...')

      const runRes = await fetch('/api/audits/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, url, responseStyle, responseLength }),
      })

      if (!runRes.ok) throw new Error(await readError(runRes))
      const auditResults = (await runRes.json()) as { results?: AuditResponse; audit?: AuditResponse }

      setResults(auditResults.results || auditResults.audit || null)
      setMessage('Audit completed successfully.')
      setUrl('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (action === 'new') {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="w-fit rounded-full px-0 text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl">Run a website audit</CardTitle>
              <CardDescription>
                Analyze any website for SEO, performance, accessibility, and UX issues you can turn into a conversation starter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website URL</label>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    disabled={loading}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response style</label>
                  <select
                    value={responseStyle}
                    onChange={(event) => setResponseStyle(event.target.value as 'professional' | 'formal' | 'advanced')}
                    className="h-12 w-full rounded-2xl border bg-background px-3 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="formal">Formal</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response length</label>
                  <select
                    value={responseLength}
                    onChange={(event) => setResponseLength(event.target.value as 'short' | 'medium' | 'long')}
                    className="h-12 w-full rounded-2xl border bg-background px-3 text-sm"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>

                {message ? (
                  <div
                    className={`rounded-3xl px-4 py-3 text-sm ${
                      message.includes('successfully') || message.includes('completed')
                        ? 'bg-emerald-500/12 text-emerald-300'
                        : message.includes('started')
                          ? 'bg-sky-500/12 text-sky-300'
                          : 'bg-rose-500/12 text-rose-300'
                    }`}
                  >
                    {message}
                  </div>
                ) : null}

                <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl">
                  {loading ? 'Running audit...' : 'Start audit'}
                  {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Why this matters</CardTitle>
              <CardDescription>Great audits turn interest into a sales conversation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                Use audit results to justify outreach and proposals with evidence instead of generic promises.
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                Completed audits flow back into your dashboard so you can track how often diagnostics lead to real deals.
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                If AI is unavailable, the workflow can still fall back safely instead of crashing the product flow.
              </div>
            </CardContent>
          </Card>
        </div>

        {results ? (
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Audit results</CardTitle>
              <CardDescription>Use this summary to guide your next sales or delivery step.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-white/8 px-4 py-4">
                  <p className="text-sm text-muted-foreground">Overall score</p>
                  <p className="mt-2 text-3xl font-semibold">{results.overallScore ?? '-'}</p>
                </div>
                <div className="rounded-3xl border border-white/8 px-4 py-4">
                  <p className="text-sm text-muted-foreground">SEO</p>
                  <p className="mt-2 text-3xl font-semibold">{results.seoScore ?? '-'}</p>
                </div>
                <div className="rounded-3xl border border-white/8 px-4 py-4">
                  <p className="text-sm text-muted-foreground">UX</p>
                  <p className="mt-2 text-3xl font-semibold">{results.uxScore ?? '-'}</p>
                </div>
                <div className="rounded-3xl border border-white/8 px-4 py-4">
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <p className="mt-2 text-3xl font-semibold">{results.performance ?? results.performanceScore ?? '-'}</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-medium">Key findings</h3>
                  {(results.findings || []).slice(0, 5).map((finding, index) => (
                    <div
                      key={`${finding.title || finding.issue || index}`}
                      className="rounded-3xl border border-white/8 px-4 py-4"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <p className="font-medium">{finding.category || 'Insight'}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {finding.issue || finding.title || finding.description || 'Needs manual review.'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Recommended next steps</h3>
                  {(results.suggestions || []).slice(0, 5).map((suggestion, index) => (
                    <div key={index} className="rounded-3xl border border-white/8 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <p className="font-medium">Recommendation {index + 1}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {typeof suggestion === 'string'
                          ? suggestion
                          : [suggestion.title, suggestion.description, suggestion.impact].filter(Boolean).join(' - ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-card/85 shadow-sm">
      <CardHeader>
        <CardTitle>Audit workspace</CardTitle>
        <CardDescription>Run a new audit to create a diagnostic your team can sell from.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/dashboard/audits?action=new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          <SearchCheck className="h-4 w-4" />
          Run new audit
        </Link>
      </CardContent>
    </Card>
  )
}
