'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  Globe,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  XCircle,
  Play,
  Loader2,
  Shield,
  Zap,
  Eye,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoAudits } from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Finding {
  category: string
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
}

interface Audit {
  id: string
  url: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  overallScore: number | null
  seoScore: number | null
  uxScore: number | null
  performance: number | null
  accessibility: number | null
  findings: Finding[]
  suggestions: string[]
  completedAt: string | null
  createdAt: string
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ─── Audit Steps for Progress ─────────────────────────────────────────────────

const AUDIT_STEPS = [
  { label: 'Crawling website pages...', range: [0, 15] },
  { label: 'Analyzing SEO...', range: [15, 35] },
  { label: 'Checking Performance...', range: [35, 55] },
  { label: 'Running Accessibility Tests...', range: [55, 75] },
  { label: 'Evaluating UX patterns...', range: [75, 90] },
  { label: 'Generating report...', range: [90, 100] },
]

// ─── Color Helpers ────────────────────────────────────────────────────────────

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground'
  if (score <= 40) return 'text-red-500'
  if (score <= 70) return 'text-amber-500'
  return 'text-emerald-500'
}

function getScoreStrokeColor(score: number | null): string {
  if (score === null) return '#a3a3a3'
  if (score <= 40) return '#ef4444'
  if (score <= 70) return '#f59e0b'
  return '#10b981'
}

function getScoreBgClass(score: number | null): string {
  if (score === null) return 'bg-muted/50'
  if (score <= 40) return 'bg-red-500/10'
  if (score <= 70) return 'bg-amber-500/10'
  return 'bg-emerald-500/10'
}

function getStatusBadge(status: Audit['status']) {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 hover:bg-amber-500/20">
          <Clock className="mr-1 size-3" />
          Pending
        </Badge>
      )
    case 'running':
      return (
        <Badge className="bg-teal-500/15 text-teal-600 dark:text-teal-400 border-0 hover:bg-teal-500/20">
          <Loader2 className="mr-1 size-3 animate-spin" />
          Running
        </Badge>
      )
    case 'completed':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/20">
          <CheckCircle className="mr-1 size-3" />
          Completed
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-0 hover:bg-red-500/20">
          <XCircle className="mr-1 size-3" />
          Failed
        </Badge>
      )
  }
}

function getSeverityBadge(severity: Finding['severity']) {
  switch (severity) {
    case 'high':
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-0 text-[10px] px-1.5 py-0">
          High
        </Badge>
      )
    case 'medium':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 text-[10px] px-1.5 py-0">
          Medium
        </Badge>
      )
    case 'low':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-1.5 py-0">
          Low
        </Badge>
      )
  }
}

// ─── Circular Score Component ─────────────────────────────────────────────────

interface CircularScoreProps {
  score: number | null
  size?: number
  strokeWidth?: number
  label?: string
  delay?: number
}

function CircularScore({
  score,
  size = 80,
  strokeWidth = 6,
  label,
  delay = 0,
}: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference
  const strokeColor = getScoreStrokeColor(score)
  const textColor = getScoreColor(score)

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('text-lg font-bold', textColor)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.5 }}
          >
            {score !== null ? score : '—'}
          </motion.span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
    </motion.div>
  )
}

// ─── Generate Mock Audit Result ───────────────────────────────────────────────

function generateMockAuditResult(url: string): Omit<Audit, 'id' | 'createdAt'> {
  const overallScore = Math.floor(Math.random() * 40) + 45 // 45-84
  const seoScore = Math.floor(Math.random() * 40) + 40
  const uxScore = Math.floor(Math.random() * 35) + 50
  const performance = Math.floor(Math.random() * 40) + 40
  const accessibility = Math.floor(Math.random() * 40) + 45

  return {
    url,
    status: 'completed',
    progress: 100,
    overallScore,
    seoScore,
    uxScore,
    performance,
    accessibility,
    findings: [
      { category: 'SEO', severity: seoScore < 60 ? 'high' : 'medium', title: 'Missing meta descriptions', description: `${Math.floor(Math.random() * 15) + 3} pages are missing meta description tags, impacting search engine click-through rates.` },
      { category: 'SEO', severity: 'medium', title: 'No structured data markup', description: 'No Schema.org markup found. Adding structured data can improve search visibility.' },
      { category: 'Performance', severity: performance < 60 ? 'high' : 'medium', title: 'Large uncompressed images', description: `Found ${Math.floor(Math.random() * 8) + 2} images over 500KB. Implement WebP format and lazy loading.` },
      { category: 'UX', severity: 'medium', title: 'No clear CTA hierarchy', description: 'Multiple competing CTAs on homepage. Consider primary/secondary CTA structure.' },
      { category: 'Accessibility', severity: accessibility < 60 ? 'high' : 'low', title: 'Low contrast ratio', description: `${Math.floor(Math.random() * 5) + 1} text elements fail WCAG AA contrast requirements.` },
      { category: 'Performance', severity: 'low', title: 'Render-blocking JavaScript', description: `${Math.floor(Math.random() * 4) + 1} render-blocking JS files detected. Defer non-critical scripts.` },
    ],
    suggestions: [
      'Implement meta descriptions on all pages to improve SERP click-through rates by up to 30%',
      'Add Schema.org structured data for better rich snippet visibility',
      'Convert images to WebP and implement lazy loading to reduce page load by 40%',
      'Redesign CTA hierarchy with one primary action per page section',
      'Fix color contrast issues to meet WCAG AA standards',
      'Defer non-critical JavaScript to improve First Contentful Paint',
    ],
    completedAt: new Date().toISOString(),
  }
}

// ─── Main Audit Module ────────────────────────────────────────────────────────

export default function AuditModule() {


  // State
  const [audits, setAudits] = useState<Audit[]>(() =>
    demoAudits.map((a) => ({ ...a }) as Audit)
  )
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null)
  const [showNewAuditDialog, setShowNewAuditDialog] = useState(false)
  const [newAuditUrl, setNewAuditUrl] = useState('')
  const [newAuditUrlError, setNewAuditUrlError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [runningProgress, setRunningProgress] = useState(0)
  const [runningAuditId, setRunningAuditId] = useState<string | null>(null)
  const [showDetailSheet, setShowDetailSheet] = useState(false)

  // Determine current step
  const currentStep = useMemo(() => {
    for (let i = AUDIT_STEPS.length - 1; i >= 0; i--) {
      if (runningProgress >= AUDIT_STEPS[i].range[0]) {
        return AUDIT_STEPS[i]
      }
    }
    return AUDIT_STEPS[0]
  }, [runningProgress])

  // Progress simulation
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setRunningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Vary increment speed slightly for realism
        const increment = Math.random() > 0.7 ? 3 : 2
        return Math.min(prev + increment, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning])

  // When progress reaches 100, complete the audit
  useEffect(() => {
    if (runningProgress >= 100 && isRunning && runningAuditId) {
      const timer = setTimeout(() => {
        setAudits((prev) =>
          prev.map((a) => {
            if (a.id === runningAuditId) {
              const result = generateMockAuditResult(a.url)
              return {
                ...a,
                ...result,
              }
            }
            return a
          })
        )
        setIsRunning(false)
        setRunningAuditId(null)
        toast.success('Audit Complete', {
          description: `Website audit for ${audits.find((a) => a.id === runningAuditId)?.url} has finished.`,
        })
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [runningProgress, isRunning, runningAuditId, audits])

  // Validate URL
  const validateUrl = useCallback((url: string): boolean => {
    if (!url.trim()) {
      setNewAuditUrlError('URL is required')
      return false
    }
    // Basic domain validation
    const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    if (!domainPattern.test(url.trim())) {
      setNewAuditUrlError('Please enter a valid URL (e.g., example.com)')
      return false
    }
    setNewAuditUrlError('')
    return true
  }, [])

  // Start new audit
  const handleStartAudit = useCallback(() => {
    if (!validateUrl(newAuditUrl)) return

    const cleanUrl = newAuditUrl.trim().replace(/^https?:\/\//, '')
    const newAudit: Audit = {
      id: `audit-${Date.now()}`,
      url: cleanUrl,
      status: 'running',
      progress: 0,
      overallScore: null,
      seoScore: null,
      uxScore: null,
      performance: null,
      accessibility: null,
      findings: [],
      suggestions: [],
      completedAt: null,
      createdAt: new Date().toISOString(),
    }

    setAudits((prev) => [newAudit, ...prev])
    setRunningAuditId(newAudit.id)
    setRunningProgress(0)
    setIsRunning(true)
    setShowNewAuditDialog(false)
    setNewAuditUrl('')
    setNewAuditUrlError('')
  }, [newAuditUrl, validateUrl])

  // Cancel audit
  const handleCancelAudit = useCallback(() => {
    if (runningAuditId) {
      setAudits((prev) =>
        prev.map((a) =>
          a.id === runningAuditId ? { ...a, status: 'failed' as const, progress: runningProgress } : a
        )
      )
    }
    setIsRunning(false)
    setRunningAuditId(null)
    setRunningProgress(0)
    toast.info('Audit Cancelled', {
      description: 'The running audit has been cancelled.',
    })
  }, [runningAuditId, runningProgress])

  // View audit details
  const handleViewAudit = useCallback((audit: Audit) => {
    setSelectedAudit(audit)
    setShowDetailSheet(true)
  }, [])

  // Re-run audit
  const handleRerunAudit = useCallback(
    (audit: Audit) => {
      const updatedAudit: Audit = {
        ...audit,
        id: `audit-${Date.now()}`,
        status: 'running',
        progress: 0,
        overallScore: null,
        seoScore: null,
        uxScore: null,
        performance: null,
        accessibility: null,
        findings: [],
        suggestions: [],
        completedAt: null,
        createdAt: new Date().toISOString(),
      }

      setAudits((prev) => [updatedAudit, ...prev])
      setRunningAuditId(updatedAudit.id)
      setRunningProgress(0)
      setIsRunning(true)
      setShowDetailSheet(false)
      toast.info('Re-running Audit', {
        description: `Starting a new audit for ${audit.url}...`,
      })
    },
    [],
  )

  // Export report
  const handleExportReport = useCallback(() => {
    toast.success('Report Exported', {
      description: 'Your audit report has been downloaded successfully.',
    })
  }, [])

  // The running audit (could be a new one or from demo data)
  const activeRunningAudit = useMemo(() => {
    if (!isRunning || !runningAuditId) return null
    return audits.find((a) => a.id === runningAuditId) || null
  }, [isRunning, runningAuditId, audits])

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header Section ──────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Website Audit</h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered SEO, UX &amp; performance analysis for any website
                </p>
              </div>
            </div>
          </div>
          <Dialog open={showNewAuditDialog} onOpenChange={setShowNewAuditDialog}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                disabled={isRunning}
              >
                <Search className="h-4 w-4" />
                New Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  Run New Audit
                </DialogTitle>
                <DialogDescription>
                  Enter a website URL to run a comprehensive AI-powered audit analyzing SEO, performance, accessibility, and UX.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="audit-url">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="audit-url"
                      placeholder="e.g., example.com"
                      className="pl-9"
                      value={newAuditUrl}
                      onChange={(e) => {
                        setNewAuditUrl(e.target.value)
                        if (newAuditUrlError) setNewAuditUrlError('')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStartAudit()
                      }}
                    />
                  </div>
                  {newAuditUrlError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {newAuditUrlError}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewAuditDialog(false)
                    setNewAuditUrl('')
                    setNewAuditUrlError('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartAudit}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="h-4 w-4" />
                  Run Audit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ─── Active Audit Progress ───────────────────────────────────────── */}
      <AnimatePresence>
        {isRunning && activeRunningAudit && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                  {/* Left: Spinner + info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="h-14 w-14 rounded-xl bg-teal-500/10 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="h-7 w-7 text-teal-500" />
                      </motion.div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Auditing {activeRunningAudit.url}
                        </h3>
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                          {currentStep.label}
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-teal-600 dark:text-teal-400">
                            {runningProgress}%
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${runningProgress}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                      {/* Steps indicator */}
                      <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                        {AUDIT_STEPS.map((step, i) => {
                          const isActive = runningProgress >= step.range[0] && runningProgress < step.range[1]
                          const isDone = runningProgress >= step.range[1]
                          return (
                            <div
                              key={i}
                              className={cn(
                                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                                isDone
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : isActive
                                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                                    : 'bg-muted/50 text-muted-foreground'
                              )}
                            >
                              {isDone ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : isActive ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                              )}
                              {step.label.replace('...', '')}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Right: Cancel button */}
                  <Button
                    variant="outline"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 shrink-0"
                    onClick={handleCancelAudit}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Audit History Table ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audit History</CardTitle>
            <CardDescription>All past and current website audits</CardDescription>
            <CardAction>
              <Badge variant="secondary" className="text-xs">
                {audits.length} audit{audits.length !== 1 ? 's' : ''}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {audits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Globe className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm font-medium">No audits yet</p>
                <p className="text-xs mt-1">Run your first website audit to get started</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Overall Score</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audits.map((audit) => (
                      <TableRow
                        key={audit.id}
                        className="cursor-pointer group"
                        onClick={() => handleViewAudit(audit)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                            <span className="font-medium text-sm">{audit.url}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(audit.status)}</TableCell>
                        <TableCell className="text-center">
                          {audit.overallScore !== null ? (
                            <div className="flex items-center justify-center">
                              <CircularScore score={audit.overallScore} size={40} strokeWidth={4} />
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewAudit(audit)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Quick Stats Row ─────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{audits.filter((a) => a.status === 'completed').length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10">
              <Loader2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{audits.filter((a) => a.status === 'running').length}</p>
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {audits.filter((a) => a.overallScore !== null).length > 0
                  ? Math.round(
                      audits
                        .filter((a) => a.overallScore !== null)
                        .reduce((sum, a) => sum + (a.overallScore || 0), 0) /
                        audits.filter((a) => a.overallScore !== null).length
                    )
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {audits.reduce((sum, a) => sum + a.findings.filter((f) => f.severity === 'high').length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">High Severity</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Audit Detail Sheet ──────────────────────────────────────────── */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          {selectedAudit && (
            <div className="flex flex-col h-full">
              {/* Sheet Header */}
              <div className="p-6 border-b border-border/50">
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-emerald-500" />
                    <SheetTitle className="text-lg">{selectedAudit.url}</SheetTitle>
                  </div>
                  <SheetDescription className="flex items-center gap-2">
                    {getStatusBadge(selectedAudit.status)}
                    {selectedAudit.completedAt && (
                      <span className="text-xs text-muted-foreground">
                        Completed {formatDistanceToNow(new Date(selectedAudit.completedAt), { addSuffix: true })}
                      </span>
                    )}
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Sheet Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Score Cards */}
                  {selectedAudit.status === 'completed' && (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          Performance Scores
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                          <CircularScore
                            score={selectedAudit.overallScore}
                            size={100}
                            strokeWidth={8}
                            label="Overall"
                            delay={0}
                          />
                          <CircularScore
                            score={selectedAudit.seoScore}
                            size={80}
                            strokeWidth={6}
                            label="SEO"
                            delay={0.1}
                          />
                          <CircularScore
                            score={selectedAudit.uxScore}
                            size={80}
                            strokeWidth={6}
                            label="UX"
                            delay={0.2}
                          />
                          <CircularScore
                            score={selectedAudit.performance}
                            size={80}
                            strokeWidth={6}
                            label="Performance"
                            delay={0.3}
                          />
                          <CircularScore
                            score={selectedAudit.accessibility}
                            size={80}
                            strokeWidth={6}
                            label="Accessibility"
                            delay={0.4}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Findings */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Findings
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(
                            selectedAudit.findings.reduce(
                              (acc, f) => {
                                if (!acc[f.category]) acc[f.category] = []
                                acc[f.category].push(f)
                                return acc
                              },
                              {} as Record<string, Finding[]>
                            )
                          ).map(([category, findings]) => (
                            <div key={category}>
                              <div className="flex items-center gap-2 mb-2">
                                {category === 'SEO' && <Search className="h-4 w-4 text-emerald-500" />}
                                {category === 'Performance' && <Zap className="h-4 w-4 text-amber-500" />}
                                {category === 'UX' && <Eye className="h-4 w-4 text-teal-500" />}
                                {category === 'Accessibility' && <Shield className="h-4 w-4 text-red-500" />}
                                <h4 className="text-sm font-semibold">{category}</h4>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {findings.length}
                                </Badge>
                              </div>
                              <div className="space-y-2 ml-6">
                                {findings.map((finding, i) => (
                                  <motion.div
                                    key={i}
                                    className={cn(
                                      'rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30',
                                      getScoreBgClass(
                                        finding.severity === 'high'
                                          ? 30
                                          : finding.severity === 'medium'
                                            ? 55
                                            : 85
                                      )
                                    )}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm font-medium">{finding.title}</span>
                                          {getSeverityBadge(finding.severity)}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {finding.description}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Suggestions */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          AI Suggestions
                        </h3>
                        <div className="space-y-2">
                          {selectedAudit.suggestions.map((suggestion, i) => (
                            <motion.div
                              key={i}
                              className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/30 transition-colors"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                            >
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                {i + 1}
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Running state in detail */}
                  {selectedAudit.status === 'running' && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="h-12 w-12 text-teal-500" />
                      </motion.div>
                      <p className="mt-4 font-medium">Audit in progress</p>
                      <p className="text-sm mt-1">This audit is currently running. Check back soon for results.</p>
                    </div>
                  )}

                  {/* Pending state */}
                  {selectedAudit.status === 'pending' && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Clock className="h-12 w-12 opacity-30" />
                      <p className="mt-4 font-medium">Audit pending</p>
                      <p className="text-sm mt-1">This audit is queued and will start shortly.</p>
                    </div>
                  )}

                  {/* Failed state */}
                  {selectedAudit.status === 'failed' && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <XCircle className="h-12 w-12 text-red-400" />
                      <p className="mt-4 font-medium text-red-500">Audit failed</p>
                      <p className="text-sm mt-1">This audit could not be completed. Try re-running it.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Sheet Footer */}
              <div className="border-t border-border/50 p-4 flex items-center gap-3">
                {selectedAudit.status === 'completed' && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleExportReport}
                  >
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                )}
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleRerunAudit(selectedAudit)}
                  disabled={isRunning}
                >
                  <RefreshCw className="h-4 w-4" />
                  Re-run Audit
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
