'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { demoOutreach } from '@/lib/demo-data'
import { cn } from '@/lib/utils'
import { containerVariants, itemVariants } from '@/lib/animations'

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

// Lucide icons
import {
  Send,
  Plus,
  Search,
  Filter,
  Mail,
  Linkedin,
  Copy,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Sparkles,
  MoreHorizontal,
  ArrowRight,
  FileText,
  Megaphone,
  Users,
  Target,
  MessageSquare,
  Zap,
  Loader2,
  X,
  LayoutTemplate,
  ChevronDown,
  GripVertical,
  Eye,
  RotateCcw,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SequenceStep {
  step: number
  type: string
  delay: string
  subject: string
}

interface OutreachCampaign {
  id: string
  name: string
  type: 'cold_email' | 'follow_up' | 'linkedin' | 'multi_channel'
  tone: 'professional' | 'friendly' | 'casual' | 'formal'
  industry: string
  targetAudience: string
  subjectLine: string
  content: string
  cta: string
  sequence: SequenceStep[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  createdAt: string
}

// ─── Template Gallery Data ────────────────────────────────────────────────────

const outreachTemplates = [
  {
    id: 't1',
    name: 'Cold SaaS Outreach',
    description: 'Target CTOs at mid-market SaaS companies',
    type: 'cold_email' as const,
    tone: 'professional' as const,
    industry: 'SaaS',
    targetAudience: 'CTOs and VP of Engineering',
  },
  {
    id: 't2',
    name: 'E-commerce Follow-up',
    description: 'Follow up with e-commerce leads after audit',
    type: 'follow_up' as const,
    tone: 'friendly' as const,
    industry: 'E-commerce',
    targetAudience: 'Marketing directors',
  },
  {
    id: 't3',
    name: 'LinkedIn Connection',
    description: 'Connect with decision-makers on LinkedIn',
    type: 'linkedin' as const,
    tone: 'casual' as const,
    industry: 'Any',
    targetAudience: 'Business owners and executives',
  },
  {
    id: 't4',
    name: 'Multi-Channel Nurture',
    description: 'Email + LinkedIn nurture sequence',
    type: 'multi_channel' as const,
    tone: 'professional' as const,
    industry: 'B2B',
    targetAudience: 'Decision-makers at target accounts',
  },
  {
    id: 't5',
    name: 'Agency Introduction',
    description: 'Introduce your agency to potential clients',
    type: 'cold_email' as const,
    tone: 'formal' as const,
    industry: 'Agency',
    targetAudience: 'CMOs and marketing leads',
  },
  {
    id: 't6',
    name: 'Post-Demo Follow-up',
    description: 'Follow up after a product demo',
    type: 'follow_up' as const,
    tone: 'friendly' as const,
    industry: 'Any',
    targetAudience: 'Prospects who attended demo',
  },
]

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getStatusBadge(status: OutreachCampaign['status']) {
  switch (status) {
    case 'draft':
      return (
        <Badge className="bg-slate-500/15 text-slate-600 dark:text-slate-400 border-0 hover:bg-slate-500/20">
          <FileText className="mr-1 size-3" />
          Draft
        </Badge>
      )
    case 'active':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/20">
          <Play className="mr-1 size-3" />
          Active
        </Badge>
      )
    case 'paused':
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 hover:bg-amber-500/20">
          <Pause className="mr-1 size-3" />
          Paused
        </Badge>
      )
    case 'completed':
      return (
        <Badge className="bg-teal-500/15 text-teal-600 dark:text-teal-400 border-0 hover:bg-teal-500/20">
          <CheckCircle2 className="mr-1 size-3" />
          Completed
        </Badge>
      )
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'email':
    case 'cold_email':
    case 'follow_up':
      return <Mail className="h-4 w-4" />
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />
    case 'multi_channel':
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Mail className="h-4 w-4" />
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'cold_email':
      return 'Cold Email'
    case 'follow_up':
      return 'Follow-up'
    case 'linkedin':
      return 'LinkedIn'
    case 'multi_channel':
      return 'Multi-Channel'
    default:
      return type
  }
}

function getToneBadge(tone: string) {
  const colors: Record<string, string> = {
    professional: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    friendly: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    casual: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    formal: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  }
  return (
    <Badge className={cn('border-0 text-[10px] px-1.5 py-0', colors[tone] || colors.professional)}>
      {tone.charAt(0).toUpperCase() + tone.slice(1)}
    </Badge>
  )
}

function getStepTypeIcon(stepType: string) {
  switch (stepType) {
    case 'email':
      return <Mail className="h-4 w-4 text-emerald-500" />
    case 'linkedin':
      return <Linkedin className="h-4 w-4 text-blue-500" />
    default:
      return <Send className="h-4 w-4 text-muted-foreground" />
  }
}

// ─── Main Outreach Module ─────────────────────────────────────────────────────

export default function OutreachModule() {
  const { user } = useAppStore()

  // Campaigns state
  const initialCampaigns = demoOutreach.map((c) => ({ ...c, sequence: c.sequence.map((s) => ({ ...s })) })) as OutreachCampaign[]
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>(initialCampaigns)

  // UI state
  const [selectedCampaign, setSelectedCampaign] = useState<OutreachCampaign | null>(null)
  const [showDetailSheet, setShowDetailSheet] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Create form state
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<OutreachCampaign['type']>('cold_email')
  const [formTone, setFormTone] = useState<OutreachCampaign['tone']>('professional')
  const [formIndustry, setFormIndustry] = useState('')
  const [formTargetAudience, setFormTargetAudience] = useState('')

  // AI generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSubject, setGeneratedSubject] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedCta, setGeneratedCta] = useState('')
  const [generatedSequence, setGeneratedSequence] = useState<SequenceStep[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)

  // Edit state
  const [editingCampaign, setEditingCampaign] = useState<OutreachCampaign | null>(null)

  // Active tab
  const [activeTab, setActiveTab] = useState('campaigns')

  // ─── Filtered Campaigns ───────────────────────────────────────────────────

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesType = typeFilter === 'all' || c.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [campaigns, searchQuery, statusFilter, typeFilter])

  // ─── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  }), [campaigns])

  // ─── Reset Form ───────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormName('')
    setFormType('cold_email')
    setFormTone('professional')
    setFormIndustry('')
    setFormTargetAudience('')
    setGeneratedSubject('')
    setGeneratedContent('')
    setGeneratedCta('')
    setGeneratedSequence([])
    setHasGenerated(false)
    setIsGenerating(false)
  }, [])

  // ─── AI Generate ──────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!formType) {
      toast.error('Missing information', { description: 'Please select a campaign type.' })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          tone: formTone,
          industry: formIndustry,
          targetAudience: formTargetAudience,
          userId: user?.id || 'demo-user-1',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate outreach content')
      }

      const data = await response.json()
      const generated = data.generated || data.campaign || data

      setGeneratedSubject(generated.subject || generated.subjectLine || '')
      setGeneratedContent(generated.content || '')
      setGeneratedCta(generated.cta || '')
      setGeneratedSequence(
        Array.isArray(generated.sequence)
          ? generated.sequence.map((s: SequenceStep, i: number) => ({
              ...s,
              step: i + 1,
            }))
          : []
      )
      setHasGenerated(true)

      if (!formName) {
        const autoName = `${getTypeLabel(formType)} - ${formIndustry || 'General'} Campaign`
        setFormName(autoName)
      }

      toast.success('Content Generated', {
        description: 'AI has generated your outreach content. Review and edit before saving.',
      })
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Generation Failed', {
        description: 'Could not generate content. Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }, [formType, formTone, formIndustry, formTargetAudience, formName, user])

  // ─── Save Campaign ────────────────────────────────────────────────────────

  const handleSaveCampaign = useCallback(
    (status: 'draft' | 'active') => {
      if (!formName.trim()) {
        toast.error('Name required', { description: 'Please enter a campaign name.' })
        return
      }

      if (editingCampaign) {
        // Update existing campaign
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === editingCampaign.id
              ? {
                  ...c,
                  name: formName,
                  type: formType,
                  tone: formTone,
                  industry: formIndustry,
                  targetAudience: formTargetAudience,
                  subjectLine: generatedSubject || c.subjectLine,
                  content: generatedContent || c.content,
                  cta: generatedCta || c.cta,
                  sequence: generatedSequence.length > 0 ? generatedSequence : c.sequence,
                  status,
                }
              : c
          )
        )
        toast.success('Campaign Updated', {
          description: `"${formName}" has been updated.`,
        })
      } else {
        // Create new campaign
        const newCampaign: OutreachCampaign = {
          id: `outreach-${Date.now()}`,
          name: formName,
          type: formType,
          tone: formTone,
          industry: formIndustry,
          targetAudience: formTargetAudience,
          subjectLine: generatedSubject,
          content: generatedContent,
          cta: generatedCta,
          sequence: generatedSequence.length > 0 ? generatedSequence : [],
          status,
          createdAt: new Date().toISOString(),
        }

        setCampaigns((prev) => [newCampaign, ...prev])

        toast.success(status === 'active' ? 'Campaign Activated' : 'Campaign Saved', {
          description: `"${formName}" has been ${status === 'active' ? 'activated' : 'saved as draft'}.`,
        })

        // Also try to save to API in background
        fetch('/api/outreach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            type: formType,
            tone: formTone,
            industry: formIndustry,
            targetAudience: formTargetAudience,
            subjectLine: generatedSubject,
            content: generatedContent,
            cta: generatedCta,
            sequence: generatedSequence,
            userId: user?.id || 'demo-user-1',
          }),
        }).catch(() => {
          // Silently fail - local state is the source of truth for demo
        })
      }

      resetForm()
      setShowCreateDialog(false)
      setEditingCampaign(null)
    },
    [
      formName,
      formType,
      formTone,
      formIndustry,
      formTargetAudience,
      generatedSubject,
      generatedContent,
      generatedCta,
      generatedSequence,
      editingCampaign,
      resetForm,
      user,
    ]
  )

  // ─── Delete Campaign ──────────────────────────────────────────────────────

  const handleDeleteCampaign = useCallback((id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    setShowDeleteConfirm(null)
    setShowDetailSheet(false)
    setSelectedCampaign(null)
    toast.success('Campaign Deleted', {
      description: 'The campaign has been removed.',
    })
  }, [])

  // ─── Change Campaign Status ───────────────────────────────────────────────

  const handleChangeStatus = useCallback(
    (id: string, newStatus: OutreachCampaign['status']) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      toast.success('Status Updated', {
        description: `Campaign is now ${newStatus}.`,
      })
      // Update selectedCampaign if it's the one being changed
      if (selectedCampaign?.id === id) {
        setSelectedCampaign((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    },
    [selectedCampaign]
  )

  // ─── Copy Content ─────────────────────────────────────────────────────────

  const handleCopyContent = useCallback((content: string, label: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success('Copied', { description: `${label} copied to clipboard.` })
      },
      () => {
        toast.error('Copy Failed', { description: 'Could not copy to clipboard.' })
      }
    )
  }, [])

  // ─── View Campaign Detail ─────────────────────────────────────────────────

  const handleViewCampaign = useCallback((campaign: OutreachCampaign) => {
    setSelectedCampaign(campaign)
    setShowDetailSheet(true)
  }, [])

  // ─── Edit Campaign ────────────────────────────────────────────────────────

  const handleEditCampaign = useCallback((campaign: OutreachCampaign) => {
    setEditingCampaign(campaign)
    setFormName(campaign.name)
    setFormType(campaign.type)
    setFormTone(campaign.tone)
    setFormIndustry(campaign.industry)
    setFormTargetAudience(campaign.targetAudience)
    setGeneratedSubject(campaign.subjectLine)
    setGeneratedContent(campaign.content)
    setGeneratedCta(campaign.cta)
    setGeneratedSequence(campaign.sequence.map((s) => ({ ...s })))
    setHasGenerated(true)
    setShowCreateDialog(true)
    setShowDetailSheet(false)
  }, [])

  // ─── Use Template ─────────────────────────────────────────────────────────

  const handleUseTemplate = useCallback((template: (typeof outreachTemplates)[0]) => {
    resetForm()
    setFormName(template.name)
    setFormType(template.type)
    setFormTone(template.tone)
    setFormIndustry(template.industry)
    setFormTargetAudience(template.targetAudience)
    setShowCreateDialog(true)
    setActiveTab('campaigns')
  }, [resetForm])

  // ─── Sequence Step Management ─────────────────────────────────────────────

  const handleAddSequenceStep = useCallback(() => {
    const newStep: SequenceStep = {
      step: generatedSequence.length + 1,
      type: 'email',
      delay: `${(generatedSequence.length + 1) * 3} days`,
      subject: '',
    }
    setGeneratedSequence((prev) => [...prev, newStep])
  }, [generatedSequence.length])

  const handleRemoveSequenceStep = useCallback((index: number) => {
    setGeneratedSequence((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, step: i + 1 }))
    )
  }, [])

  const handleUpdateSequenceStep = useCallback(
    (index: number, field: keyof SequenceStep, value: string) => {
      setGeneratedSequence((prev) =>
        prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      )
    },
    []
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header Section ────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Outreach</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered outreach campaigns &amp; sequences
              </p>
            </div>
          </div>
          <Button
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            onClick={() => {
              resetForm()
              setEditingCampaign(null)
              setShowCreateDialog(true)
            }}
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* ─── Stats Row ─────────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Megaphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10">
              <Play className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-500/10">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Main Tabs ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="campaigns" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5">
              <LayoutTemplate className="h-3.5 w-3.5" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* ─── Campaigns Tab ───────────────────────────────────────────────── */}
          <TabsContent value="campaigns" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="cold_email">Cold Email</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="multi_channel">Multi-Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campaign Cards Grid */}
            {filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Send className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-sm font-medium">No campaigns found</p>
                    <p className="text-xs mt-1">
                      {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Create your first outreach campaign to get started'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                      <Button
                        className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="sm"
                        onClick={() => {
                          resetForm()
                          setEditingCampaign(null)
                          setShowCreateDialog(true)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Create Campaign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-500/30 group"
                      onClick={() => handleViewCampaign(campaign)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
                              {getTypeIcon(campaign.type)}
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-sm font-semibold truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {campaign.name}
                              </CardTitle>
                              <CardDescription className="text-xs truncate">
                                {campaign.industry} &middot; {getTypeLabel(campaign.type)}
                              </CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewCampaign(campaign)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCampaign(campaign)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {campaign.status === 'draft' && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleChangeStatus(campaign.id, 'active')
                                  }}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {campaign.status === 'active' && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleChangeStatus(campaign.id, 'paused')
                                  }}
                                >
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </DropdownMenuItem>
                              )}
                              {(campaign.status === 'active' || campaign.status === 'paused') && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleChangeStatus(campaign.id, 'completed')
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowDeleteConfirm(campaign.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <div className="space-y-3">
                          {/* Subject line preview */}
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {campaign.subjectLine || 'No subject line yet'}
                          </p>
                          {/* Tags and status */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(campaign.status)}
                            {getToneBadge(campaign.tone)}
                          </div>
                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(campaign.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(campaign.type)}
                              {campaign.sequence.length} step{campaign.sequence.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Templates Tab ───────────────────────────────────────────────── */}
          <TabsContent value="templates" className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-emerald-500" />
                Template Gallery
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {outreachTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="transition-all duration-300 hover:shadow-lg hover:border-emerald-500/30 group h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
                              {getTypeIcon(template.type)}
                            </div>
                            <CardTitle className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {template.name}
                            </CardTitle>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] shrink-0">
                            {getTypeLabel(template.type)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4 flex-1 flex flex-col">
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {getToneBadge(template.tone)}
                          <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-0 text-[10px]">
                            {template.industry}
                          </Badge>
                        </div>
                        <div className="mt-auto">
                          <Button
                            size="sm"
                            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ─── Create / Edit Campaign Dialog ──────────────────────────────────── */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
            setEditingCampaign(null)
          }
          setShowCreateDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? 'Update your outreach campaign details and content.'
                : 'Configure your campaign and use AI to generate compelling outreach content.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-4">
              {/* ─ Form Fields ─ */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input
                    placeholder="e.g., Q1 SaaS Outreach"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as OutreachCampaign['type'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cold_email">Cold Email</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="multi_channel">Multi-Channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={formTone} onValueChange={(v) => setFormTone(v as OutreachCampaign['tone'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input
                    placeholder="e.g., SaaS, E-commerce"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    placeholder="e.g., CTOs at mid-market companies"
                    value={formTargetAudience}
                    onChange={(e) => setFormTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              {/* ─ Generate Button ─ */}
              <div className="flex flex-col items-center gap-3 py-2">
                <Button
                  className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg w-full sm:w-auto"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
                {isGenerating && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    AI is crafting your outreach content...
                  </div>
                )}
              </div>

              {/* ─ Generated Content ─ */}
              <AnimatePresence>
                {hasGenerated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-emerald-500" />
                          Subject Line
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleCopyContent(generatedSubject, 'Subject line')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy subject</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        value={generatedSubject}
                        onChange={(e) => setGeneratedSubject(e.target.value)}
                        placeholder="Subject line will appear here..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-emerald-500" />
                          Email Content
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleCopyContent(generatedContent, 'Email content')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy content</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={8}
                        placeholder="Generated email content will appear here..."
                        className="text-sm leading-relaxed resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 text-emerald-500" />
                          Call-to-Action
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleCopyContent(generatedCta, 'CTA')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy CTA</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        value={generatedCta}
                        onChange={(e) => setGeneratedCta(e.target.value)}
                        placeholder="Call-to-action will appear here..."
                      />
                    </div>

                    {/* ─ Sequence Builder ─ */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-1.5">
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
                          Sequence Steps
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs h-7"
                          onClick={handleAddSequenceStep}
                        >
                          <Plus className="h-3 w-3" />
                          Add Step
                        </Button>
                      </div>

                      {generatedSequence.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border border-dashed border-border/50 rounded-lg">
                          <ArrowRight className="h-6 w-6 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No sequence steps yet. Generate with AI or add manually.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {generatedSequence.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors"
                            >
                              {/* Step number and connector */}
                              <div className="flex flex-col items-center gap-1 shrink-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  {step.step}
                                </div>
                                {index < generatedSequence.length - 1 && (
                                  <div className="w-0.5 h-4 bg-border/50" />
                                )}
                              </div>

                              {/* Step content */}
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Type
                                  </label>
                                  <Select
                                    value={step.type}
                                    onValueChange={(v) =>
                                      handleUpdateSequenceStep(index, 'type', v)
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="email">
                                        <span className="flex items-center gap-1.5">
                                          <Mail className="h-3 w-3" />
                                          Email
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="linkedin">
                                        <span className="flex items-center gap-1.5">
                                          <Linkedin className="h-3 w-3" />
                                          LinkedIn
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Delay
                                  </label>
                                  <Input
                                    className="h-8 text-xs"
                                    value={step.delay}
                                    onChange={(e) =>
                                      handleUpdateSequenceStep(index, 'delay', e.target.value)
                                    }
                                    placeholder="3 days"
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Subject
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <Input
                                      className="h-8 text-xs"
                                      value={step.subject}
                                      onChange={(e) =>
                                        handleUpdateSequenceStep(index, 'subject', e.target.value)
                                      }
                                      placeholder="Step subject..."
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 shrink-0 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                      onClick={() => handleRemoveSequenceStep(index)}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setEditingCampaign(null)
                setShowCreateDialog(false)
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleSaveCampaign('draft')}
                disabled={!formName.trim()}
              >
                <FileText className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleSaveCampaign('active')}
                disabled={!formName.trim()}
              >
                <Play className="h-4 w-4" />
                {editingCampaign ? 'Update & Activate' : 'Create & Activate'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Campaign Detail Sheet ──────────────────────────────────────────── */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 max-h-[100vh]">
          {selectedCampaign && (
            <div className="flex flex-col h-full">
              {/* Sheet Header */}
              <div className="p-6 border-b border-border/50">
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                      {getTypeIcon(selectedCampaign.type)}
                    </div>
                    <SheetTitle className="text-lg">{selectedCampaign.name}</SheetTitle>
                  </div>
                  <SheetDescription className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(selectedCampaign.status)}
                    <span className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(selectedCampaign.createdAt), { addSuffix: true })}
                    </span>
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Sheet Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Campaign Meta */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Campaign Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-lg border border-border/50 p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {getTypeIcon(selectedCampaign.type)}
                          {getTypeLabel(selectedCampaign.type)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/50 p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Tone</p>
                        <div className="flex items-center gap-1.5">
                          {getToneBadge(selectedCampaign.tone)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/50 p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
                        <p className="text-sm font-medium">{selectedCampaign.industry || '—'}</p>
                      </div>
                      <div className="rounded-lg border border-border/50 p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Target Audience</p>
                        <p className="text-sm font-medium truncate">{selectedCampaign.targetAudience || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Subject Line */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-emerald-500" />
                        Subject Line
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() => handleCopyContent(selectedCampaign.subjectLine, 'Subject line')}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 p-4 bg-muted/20">
                      <p className="text-sm font-medium">{selectedCampaign.subjectLine || 'No subject line'}</p>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-emerald-500" />
                        Email Content
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() => handleCopyContent(selectedCampaign.content, 'Email content')}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 p-4 bg-muted/20">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedCampaign.content || 'No content yet'}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-emerald-500" />
                        Call-to-Action
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() => handleCopyContent(selectedCampaign.cta, 'CTA')}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 p-4 bg-emerald-500/5">
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {selectedCampaign.cta || 'No CTA defined'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Sequence Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
                      Sequence Timeline
                    </h3>
                    {selectedCampaign.sequence.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border border-dashed border-border/50 rounded-lg">
                        <ArrowRight className="h-6 w-6 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No sequence steps defined</p>
                      </div>
                    ) : (
                      <div className="relative space-y-0">
                        {selectedCampaign.sequence.map((step, index) => (
                          <motion.div
                            key={index}
                            className="flex gap-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                          >
                            {/* Timeline line and node */}
                            <div className="flex flex-col items-center shrink-0">
                              <div
                                className={cn(
                                  'flex h-10 w-10 items-center justify-center rounded-full border-2 shrink-0',
                                  step.type === 'email'
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-blue-500/10 border-blue-500/30'
                                )}
                              >
                                {getStepTypeIcon(step.type)}
                              </div>
                              {index < selectedCampaign.sequence.length - 1 && (
                                <div className="w-0.5 flex-1 min-h-[24px] bg-border/50 my-1" />
                              )}
                            </div>

                            {/* Step content */}
                            <div className={cn(
                              'flex-1 rounded-lg border border-border/50 p-3 mb-3',
                              index < selectedCampaign.sequence.length - 1 ? '' : 'mb-0'
                            )}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  Step {step.step}
                                </span>
                                <Badge className="bg-muted text-muted-foreground border-0 text-[10px] px-1.5 py-0">
                                  {step.type === 'email' ? 'Email' : 'LinkedIn'}
                                </Badge>
                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 text-[10px] px-1.5 py-0">
                                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                                  {step.delay}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">
                                {step.subject}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleEditCampaign(selectedCampaign)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Campaign
                    </Button>
                    {selectedCampaign.status === 'draft' && (
                      <Button
                        className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => handleChangeStatus(selectedCampaign.id, 'active')}
                      >
                        <Play className="h-4 w-4" />
                        Activate
                      </Button>
                    )}
                    {selectedCampaign.status === 'active' && (
                      <Button
                        variant="outline"
                        className="gap-2 border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                        onClick={() => handleChangeStatus(selectedCampaign.id, 'paused')}
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    {selectedCampaign.status === 'paused' && (
                      <Button
                        className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => handleChangeStatus(selectedCampaign.id, 'active')}
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    {(selectedCampaign.status === 'active' || selectedCampaign.status === 'paused') && (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleChangeStatus(selectedCampaign.id, 'completed')}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
                      onClick={() => {
                        setShowDetailSheet(false)
                        setShowDeleteConfirm(selectedCampaign.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Delete Confirmation Dialog ──────────────────────────────────────── */}
      <Dialog
        open={showDeleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setShowDeleteConfirm(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Delete Campaign
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (showDeleteConfirm) handleDeleteCampaign(showDeleteConfirm)
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
