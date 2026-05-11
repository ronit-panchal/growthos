'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ProposalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    clientName: '',
    projectScope: '',
    budget: '',
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
      const response = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          projectScope: formData.projectScope,
          budget: parseInt(formData.budget, 10),
          responseStyle: formData.responseStyle,
          responseLength: formData.responseLength,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string; content?: unknown }
      if (!response.ok) throw new Error(payload.error || 'Failed to generate proposal')

      setResults(payload.content)
      setMessage('Proposal generated successfully.')
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
              <CardTitle className="text-3xl">Generate a proposal</CardTitle>
              <CardDescription>Turn buying intent into a concrete scope, pricing breakdown, and next-step document.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client name</label>
                  <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Acme Corporation" required className="h-12 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project scope</label>
                  <Input name="projectScope" value={formData.projectScope} onChange={handleChange} placeholder="Website redesign with lead capture optimization" required className="h-12 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget</label>
                  <Input name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="15000" required className="h-12 rounded-2xl" />
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
                  {loading ? 'Generating...' : 'Generate proposal'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Proposal guidance</CardTitle>
              <CardDescription>Use this when a lead is moving beyond discovery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-white/8 px-4 py-4">Start with a real business outcome, not just a list of deliverables.</div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">Use audit insights and outreach replies to make the proposal feel earned.</div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">The generated structure gives your team a strong draft to customize before sending.</div>
            </CardContent>
          </Card>
        </div>

        {results ? (
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Generated proposal draft</CardTitle>
              <CardDescription>Review, edit, and turn this into your client-facing offer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.sections && Array.isArray(results.sections) ? (
                <div className="space-y-3">
                  {results.sections.map((section: any, index: number) => (
                    <div key={index} className="rounded-3xl border border-white/8 px-4 py-4">
                      <p className="font-medium">{section.title}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{section.content}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {results.pricing && Array.isArray(results.pricing) ? (
                <div className="space-y-3">
                  <p className="font-medium">Pricing breakdown</p>
                  {results.pricing.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between rounded-3xl border border-white/8 px-4 py-4 text-sm">
                      <span>{item.item} (x{item.quantity})</span>
                      <span className="font-medium">${(item.cost || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-3xl bg-primary px-4 py-4 text-sm font-medium text-primary-foreground">
                    <span>Total value</span>
                    <span>${(results.totalValue || 0).toLocaleString()}</span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-card/85 shadow-sm">
      <CardHeader>
        <CardTitle>Proposal workspace</CardTitle>
        <CardDescription>Create a structured proposal when the lead is ready for a concrete offer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/dashboard/proposals?action=new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          <FileText className="h-4 w-4" />
          Generate proposal
        </Link>
      </CardContent>
    </Card>
  )
}
