'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Target, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSearchParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default function LeadsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    value: '',
  })

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvResult, setCsvResult] = useState<{success: number; failed: number; errors: string[]} | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: formData.value ? Number(formData.value) : 0,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) throw new Error(payload.error || 'Failed to create lead')

      setMessage('Lead created successfully. It now appears in your workspace pipeline.')
      setFormData({ name: '', email: '', company: '', title: '', value: '' })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // CSV Handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file)
        setCsvResult(null)
      } else {
        setCsvResult({ success: 0, failed: 0, errors: ['Please upload a CSV file'] })
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
      setCsvResult(null)
    }
  }

  const downloadTemplate = () => {
    const template = 'name,email,company,title,value\nJohn Doe,john@example.com,Acme Corp,CEO,5000\nJane Smith,jane@example.com,Tech Inc,Manager,3000'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const processCSV = async () => {
    if (!csvFile) return
    
    setCsvUploading(true)
    setCsvResult(null)
    
    try {
      const text = await csvFile.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        setCsvResult({ success: 0, failed: 0, errors: ['CSV file is empty or has no data rows'] })
        return
      }
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const requiredFields = ['name', 'email']
      const missingFields = requiredFields.filter(f => !headers.includes(f))
      
      if (missingFields.length > 0) {
        setCsvResult({ 
          success: 0, 
          failed: 0, 
          errors: [`Missing required columns: ${missingFields.join(', ')}`] 
        })
        return
      }
      
      const leads: any[] = []
      const errors: string[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const lead: any = {}
        
        headers.forEach((header, index) => {
          if (header === 'value') {
            lead[header] = values[index] ? Number(values[index]) : 0
          } else {
            lead[header] = values[index] || ''
          }
        })
        
        if (!lead.name || !lead.email) {
          errors.push(`Row ${i}: Missing name or email`)
        } else if (!lead.email.includes('@')) {
          errors.push(`Row ${i}: Invalid email format`)
        } else {
          leads.push(lead)
        }
      }
      
      // Simulate API calls for each lead
      let successCount = 0
      for (const lead of leads) {
        try {
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          })
          if (response.ok) successCount++
        } catch {
          errors.push(`Failed to import: ${lead.name}`)
        }
      }
      
      setCsvResult({ 
        success: successCount, 
        failed: leads.length - successCount, 
        errors: errors.slice(0, 5) // Show first 5 errors
      })
      
      if (successCount > 0) {
        setCsvFile(null)
      }
    } catch (error) {
      setCsvResult({ 
        success: 0, 
        failed: 0, 
        errors: ['Failed to parse CSV file. Please check the format.'] 
      })
    } finally {
      setCsvUploading(false)
    }
  }

  if (action === 'new') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-fit rounded-full px-0 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl">Capture a new lead</CardTitle>
              <CardDescription>
                Add the contact details, company, and deal value so your team can qualify and follow up quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lead name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Jordan Lee" required className="h-11 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jordan@company.com" required className="h-11 rounded-2xl" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input name="company" value={formData.company} onChange={handleChange} placeholder="Northstar Studio" className="h-11 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role / title</label>
                    <Input name="title" value={formData.title} onChange={handleChange} placeholder="Founder" className="h-11 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated deal value</label>
                  <Input name="value" type="number" value={formData.value} onChange={handleChange} placeholder="2500" className="h-11 rounded-2xl" />
                </div>

                {message ? (
                  <div className={`rounded-3xl px-4 py-3 text-sm ${message.includes('successfully') ? 'bg-emerald-500/12 text-emerald-300' : 'bg-rose-500/12 text-rose-300'}`}>
                    {message}
                  </div>
                ) : null}

                <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl">
                  {loading ? 'Saving lead...' : 'Create lead'}
                  {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/85 shadow-sm">
            <CardHeader>
              <CardTitle>Lead quality checklist</CardTitle>
              <CardDescription>Make every new contact useful to your sales workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                Add a real company and contact name so proposals feel personalized later.
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                Estimate deal value early to keep pipeline reporting meaningful inside the dashboard.
              </div>
              <div className="rounded-3xl border border-white/8 px-4 py-4">
                Use audits and outreach next so the lead becomes a real sales opportunity, not just a database row.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSV Import Section */}
        <Card className="border-white/10 bg-card/85 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk Import via CSV
                </CardTitle>
                <CardDescription>Import multiple leads at once using a CSV file</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="rounded-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
            >
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                {csvFile ? (
                  <span className="text-foreground font-medium">{csvFile.name}</span>
                ) : (
                  "Drag & drop your CSV file here, or click to browse"
                )}
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>

            {/* CSV Format Info */}
            <div className="bg-muted/50 rounded-xl p-4 text-sm">
              <p className="font-medium mb-2">Required CSV Format:</p>
              <code className="text-xs bg-background px-2 py-1 rounded block mb-2">
                name,email,company,title,value
              </code>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• name (required) - Contact full name</li>
                <li>• email (required) - Valid email address</li>
                <li>• company (optional) - Company name</li>
                <li>• title (optional) - Job title/role</li>
                <li>• value (optional) - Deal value in USD</li>
              </ul>
            </div>

            {/* Upload Button */}
            {csvFile && (
              <Button 
                onClick={processCSV} 
                disabled={csvUploading}
                className="w-full rounded-2xl"
              >
                {csvUploading ? 'Processing...' : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import {csvFile.name}
                  </>
                )}
              </Button>
            )}

            {/* Results */}
            {csvResult && (
              <div className={`rounded-xl p-4 ${csvResult.success > 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {csvResult.success > 0 ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-rose-500" />
                  )}
                  <span className="font-medium">
                    {csvResult.success > 0 ? 'Import Complete' : 'Import Failed'}
                  </span>
                </div>
                
                <div className="flex gap-4 mb-3">
                  {csvResult.success > 0 && (
                    <Badge variant="default" className="bg-emerald-500">
                      {csvResult.success} imported
                    </Badge>
                  )}
                  {csvResult.failed > 0 && (
                    <Badge variant="destructive">
                      {csvResult.failed} failed
                    </Badge>
                  )}
                </div>

                {csvResult.errors.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium mb-2">Errors:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {csvResult.errors.map((error, index) => (
                        <li key={index} className="text-xs">• {error}</li>
                      ))}
                      {csvResult.errors.length === 5 && <li className="text-xs">• ... and more</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-card/85 shadow-sm">
      <CardHeader>
        <CardTitle>Leads workspace</CardTitle>
        <CardDescription>Start by capturing a new opportunity and then enrich it through audits and proposals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link
          href="/dashboard/leads?action=new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          <Target className="h-4 w-4" />
          Add new lead
        </Link>
        <p className="text-sm text-muted-foreground">
          or{' '}
          <Link href="/dashboard/leads?action=new#csv" className="text-primary hover:underline">
            import multiple leads via CSV
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
