'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  FileText,
  Plus,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Trash2,
  Share2,
  Download,
  Edit3,
  Search,
  Filter,
  ChevronRight,
  X,
  Loader2,
  Building2,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { demoProposals } from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProposalSection {
  id: string
  title: string
  content: string
}

interface PricingItem {
  id: string
  item: string
  description: string
  quantity: number
  price: number
}

type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'

interface Proposal {
  id: string
  title: string
  clientName: string
  clientEmail: string
  status: ProposalStatus
  sections: ProposalSection[]
  pricing: PricingItem[]
  totalValue: number
  shareToken: string | null
  sentAt: string | null
  viewedAt: string | null
  acceptedAt: string | null
  createdAt: string
}

// ─── Animation Variants ──────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '\u2014'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Status Config ────────────────────────────────────────────────────────────

const statusConfig: Record<ProposalStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  draft: {
    label: 'Draft',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  sent: {
    label: 'Sent',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
    icon: <Send className="h-3.5 w-3.5" />,
  },
  viewed: {
    label: 'Viewed',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    icon: <Eye className="h-3.5 w-3.5" />,
  },
  accepted: {
    label: 'Accepted',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
    icon: <X className="h-3.5 w-3.5" />,
  },
}

// ─── Stats Card Component ────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  bgColor: string
}) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bgColor)}>
            <span className={color}>{icon}</span>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Status Badge Component ──────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProposalStatus }) {
  const config = statusConfig[status]
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium border text-xs px-2 py-0.5',
        config.bgColor,
        config.color
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  )
}

// ─── Status Timeline Component ───────────────────────────────────────────────

function StatusTimeline({ proposal }: { proposal: Proposal }) {
  const stages: { key: ProposalStatus; label: string; date: string | null }[] = [
    { key: 'draft', label: 'Draft Created', date: proposal.createdAt },
    { key: 'sent', label: 'Proposal Sent', date: proposal.sentAt },
    { key: 'viewed', label: 'Client Viewed', date: proposal.viewedAt },
    { key: 'accepted', label: 'Accepted', date: proposal.acceptedAt },
  ]

  const statusOrder: ProposalStatus[] = ['draft', 'sent', 'viewed', 'accepted']
  const currentIndex = statusOrder.indexOf(proposal.status)
  const rejected = proposal.status === 'rejected'

  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const isActive = !rejected && index <= currentIndex
        const isCurrent = !rejected && stage.key === proposal.status
        const isRejected = rejected && stage.key === 'sent'

        return (
          <div key={stage.key} className="flex items-center gap-3">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all',
                  isActive && 'border-emerald-500 bg-emerald-500 text-white',
                  isCurrent && 'ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-background',
                  !isActive && !isRejected && 'border-muted bg-muted/50 text-muted-foreground',
                  isRejected && index <= 1 && 'border-teal-500 bg-teal-500 text-white'
                )}
              >
                {isActive ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    'h-4 w-0.5',
                    isActive && index < currentIndex ? 'bg-emerald-500' : 'bg-muted'
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {stage.label}
                {isCurrent && (
                  <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">
                    Current
                  </span>
                )}
              </p>
              {stage.date && (
                <p className="text-xs text-muted-foreground">
                  {formatDate(stage.date)} &middot; {formatDistanceToNow(new Date(stage.date), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        )
      })}
      {rejected && (
        <div className="flex items-center gap-3 mt-1">
          <div className="relative flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-500 bg-red-500 text-white">
              <X className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Proposal Preview Card Component ─────────────────────────────────────────

function ProposalPreviewCard({ proposal }: { proposal: Proposal }) {
  const total = proposal.pricing.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-100">GrowthOS Agency</p>
                <p className="text-xs text-emerald-200/70">hello@growthagency.io</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-100">PROPOSAL</p>
              <p className="text-xs text-emerald-200/70">#{proposal.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{proposal.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prepared for <span className="font-medium text-foreground">{proposal.clientName}</span>
            {proposal.clientEmail && (
              <> &middot; {proposal.clientEmail}</>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Date: {formatDate(proposal.createdAt)}
          </p>
        </div>

        <Separator />

        {/* Sections */}
        {proposal.sections.map((section, index) => (
          <div key={section.id || index} className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {section.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}

        <Separator />

        {/* Pricing Table */}
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
            Investment
          </h3>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Item</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Qty</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {proposal.pricing.map((item, index) => (
                  <tr key={item.id || index} className="border-t border-border/40">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </td>
                    <td className="text-center px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{item.quantity}</td>
                    <td className="text-right px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{formatCurrency(item.price)}</td>
                    <td className="text-right px-4 py-2.5 font-medium text-foreground">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-emerald-50/50 dark:bg-emerald-950/20">
                  <td colSpan={3} className="px-4 py-3 text-sm font-bold text-foreground">
                    Total Investment
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProposalsModule() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [proposals, setProposals] = useState<Proposal[]>(
    () => demoProposals as unknown as Proposal[]
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all')

  // New Proposal Dialog
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newSections, setNewSections] = useState<ProposalSection[]>([
    { id: generateId(), title: 'Executive Summary', content: '' },
  ])
  const [newPricing, setNewPricing] = useState<PricingItem[]>([
    { id: generateId(), item: '', description: '', quantity: 1, price: 0 },
  ])
  const [isGenerating, setIsGenerating] = useState(false)

  // Detail Sheet
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editSections, setEditSections] = useState<ProposalSection[]>([])
  const [editPricing, setEditPricing] = useState<PricingItem[]>([])

  // ─── Computed ────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      draft: proposals.filter((p) => p.status === 'draft').length,
      sent: proposals.filter((p) => p.status === 'sent').length,
      viewed: proposals.filter((p) => p.status === 'viewed').length,
      accepted: proposals.filter((p) => p.status === 'accepted').length,
    }
  }, [proposals])

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [proposals, searchQuery, statusFilter])

  const newPricingTotal = useMemo(() => {
    return newPricing.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }, [newPricing])

  const editPricingTotal = useMemo(() => {
    return editPricing.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }, [editPricing])

  // ─── Handlers ────────────────────────────────────────────────────────────

  const resetNewForm = useCallback(() => {
    setNewTitle('')
    setNewClientName('')
    setNewClientEmail('')
    setNewSections([{ id: generateId(), title: 'Executive Summary', content: '' }])
    setNewPricing([{ id: generateId(), item: '', description: '', quantity: 1, price: 0 }])
    setIsGenerating(false)
  }, [])

  const handleGenerateAI = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      setNewSections([
        { id: generateId(), title: 'Executive Summary', content: `We are excited to present a comprehensive growth strategy tailored for ${newClientName || 'your business'}. Our data-driven approach combines cutting-edge marketing techniques with proven frameworks to deliver measurable results.` },
        { id: generateId(), title: 'Current State Analysis', content: 'Based on our initial assessment, we have identified several key opportunities for growth and optimization. Your current digital presence shows strong potential with room for strategic improvements in conversion optimization, content strategy, and paid acquisition efficiency.' },
        { id: generateId(), title: 'Proposed Strategy', content: 'Our three-phase approach includes:\n\nPhase 1: Foundation & Quick Wins \u2014 Optimize existing funnels, improve landing pages, and implement tracking.\n\nPhase 2: Growth Acceleration \u2014 Launch targeted content marketing, expand paid channels, and build automated nurture sequences.\n\nPhase 3: Scale & Optimize \u2014 Leverage data insights to scale winning campaigns and continuously optimize performance.' },
        { id: generateId(), title: 'Expected Outcomes', content: 'Based on similar engagements, we project:\n\u2022 35-50% increase in qualified leads within 90 days\n\u2022 25-40% improvement in conversion rates\n\u2022 2-3x return on ad spend within 6 months\n\u2022 Consistent month-over-month growth in pipeline value' },
      ])
      setNewPricing([
        { id: generateId(), item: 'Strategy & Planning', description: 'Initial audit, strategy development, roadmap', quantity: 1, price: 3500 },
        { id: generateId(), item: 'Implementation', description: 'Setup, configuration, content creation', quantity: 1, price: 5000 },
        { id: generateId(), item: 'Monthly Retainer', description: 'Ongoing optimization, reporting, support', quantity: 6, price: 2500 },
      ])
      setIsGenerating(false)
      toast.success('AI generated proposal content!', {
        description: 'Review and customize the generated sections.',
      })
    }, 2000)
  }, [newClientName])

  const handleSaveDraft = useCallback(() => {
    if (!newTitle.trim()) {
      toast.error('Please enter a proposal title')
      return
    }
    if (!newClientName.trim()) {
      toast.error('Please enter a client name')
      return
    }
    const proposal: Proposal = {
      id: generateId(),
      title: newTitle,
      clientName: newClientName,
      clientEmail: newClientEmail,
      status: 'draft',
      sections: newSections.filter((s) => s.title.trim() || s.content.trim()),
      pricing: newPricing.filter((p) => p.item.trim()),
      totalValue: newPricing.reduce((sum, item) => sum + item.quantity * item.price, 0),
      shareToken: null,
      sentAt: null,
      viewedAt: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [proposal, ...prev])
    setNewDialogOpen(false)
    resetNewForm()
    toast.success('Proposal saved as draft!', {
      description: `"${newTitle}" has been saved.`,
    })
  }, [newTitle, newClientName, newClientEmail, newSections, newPricing, resetNewForm])

  const handleSendProposal = useCallback(() => {
    if (!newTitle.trim()) {
      toast.error('Please enter a proposal title')
      return
    }
    if (!newClientName.trim()) {
      toast.error('Please enter a client name')
      return
    }
    if (!newClientEmail.trim()) {
      toast.error('Please enter a client email')
      return
    }
    const shareToken = `share-${Math.random().toString(36).slice(2, 10)}`
    const proposal: Proposal = {
      id: generateId(),
      title: newTitle,
      clientName: newClientName,
      clientEmail: newClientEmail,
      status: 'sent',
      sections: newSections.filter((s) => s.title.trim() || s.content.trim()),
      pricing: newPricing.filter((p) => p.item.trim()),
      totalValue: newPricing.reduce((sum, item) => sum + item.quantity * item.price, 0),
      shareToken,
      sentAt: new Date().toISOString(),
      viewedAt: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [proposal, ...prev])
    setNewDialogOpen(false)
    resetNewForm()
    toast.success('Proposal sent!', {
      description: `Sent to ${newClientEmail}.`,
    })
  }, [newTitle, newClientName, newClientEmail, newSections, newPricing, resetNewForm])

  const openDetail = useCallback((proposal: Proposal) => {
    setSelectedProposal(proposal)
    setEditSections(proposal.sections.map((s) => ({ ...s })))
    setEditPricing(proposal.pricing.map((p) => ({ ...p })))
    setIsEditing(false)
    setDetailOpen(true)
  }, [])

  const handleShare = useCallback((proposal: Proposal) => {
    const token = proposal.shareToken || `share-${Math.random().toString(36).slice(2, 10)}`
    const link = `${window.location.origin}/proposal/${token}`
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Share link copied!', {
        description: link,
      })
    }).catch(() => {
      toast.success('Share link generated!', {
        description: link,
      })
    })
  }, [])

  const handleExportPdf = useCallback((proposal: Proposal) => {
    toast.success('PDF export started!', {
      description: `"${proposal.title}" is being exported as PDF.`,
    })
  }, [])

  const handleDelete = useCallback((proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId))
    setDetailOpen(false)
    setSelectedProposal(null)
    toast.success('Proposal deleted', {
      description: 'The proposal has been permanently removed.',
    })
  }, [])

  const handleSendExisting = useCallback((proposal: Proposal) => {
    const updated = {
      ...proposal,
      status: 'sent' as ProposalStatus,
      shareToken: proposal.shareToken || `share-${Math.random().toString(36).slice(2, 10)}`,
      sentAt: new Date().toISOString(),
    }
    setProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? updated : p))
    )
    setSelectedProposal(updated)
    toast.success('Proposal sent!', {
      description: `Sent to ${proposal.clientEmail}.`,
    })
  }, [])

  const handleSaveEdit = useCallback(() => {
    if (!selectedProposal) return
    const updated: Proposal = {
      ...selectedProposal,
      sections: editSections,
      pricing: editPricing,
      totalValue: editPricing.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }
    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposal.id ? updated : p))
    )
    setSelectedProposal(updated)
    setIsEditing(false)
    toast.success('Changes saved!', {
      description: 'Proposal has been updated.',
    })
  }, [selectedProposal, editSections, editPricing])

  // ─── New Proposal Section/Pricing Builders ───────────────────────────────

  const addSection = useCallback(() => {
    setNewSections((prev) => [...prev, { id: generateId(), title: '', content: '' }])
  }, [])

  const removeSection = useCallback((id: string) => {
    setNewSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    setNewSections((prev) => {
      const index = prev.findIndex((s) => s.id === id)
      if (index === -1) return prev
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev
      const newArr = [...prev]
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      const temp = newArr[index]
      newArr[index] = newArr[swapIndex]
      newArr[swapIndex] = temp
      return newArr
    })
  }, [])

  const updateSection = useCallback((id: string, field: 'title' | 'content', value: string) => {
    setNewSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }, [])

  const addPricingItem = useCallback(() => {
    setNewPricing((prev) => [
      ...prev,
      { id: generateId(), item: '', description: '', quantity: 1, price: 0 },
    ])
  }, [])

  const removePricingItem = useCallback((id: string) => {
    setNewPricing((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updatePricingItem = useCallback(
    (id: string, field: keyof PricingItem, value: string | number) => {
      setNewPricing((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      )
    },
    []
  )

  // ─── Edit Section/Pricing Builders ───────────────────────────────────────

  const addEditSection = useCallback(() => {
    setEditSections((prev) => [...prev, { id: generateId(), title: '', content: '' }])
  }, [])

  const removeEditSection = useCallback((id: string) => {
    setEditSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const moveEditSection = useCallback((id: string, direction: 'up' | 'down') => {
    setEditSections((prev) => {
      const index = prev.findIndex((s) => s.id === id)
      if (index === -1) return prev
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev
      const newArr = [...prev]
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      const temp = newArr[index]
      newArr[index] = newArr[swapIndex]
      newArr[swapIndex] = temp
      return newArr
    })
  }, [])

  const updateEditSection = useCallback((id: string, field: 'title' | 'content', value: string) => {
    setEditSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }, [])

  const addEditPricingItem = useCallback(() => {
    setEditPricing((prev) => [
      ...prev,
      { id: generateId(), item: '', description: '', quantity: 1, price: 0 },
    ])
  }, [])

  const removeEditPricingItem = useCallback((id: string) => {
    setEditPricing((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateEditPricingItem = useCallback(
    (id: string, field: keyof PricingItem, value: string | number) => {
      setEditPricing((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      )
    },
    []
  )

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposal Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, send, and track proposals &mdash; powered by AI
          </p>
        </div>
        <Dialog open={newDialogOpen} onOpenChange={(open) => {
          setNewDialogOpen(open)
          if (!open) resetNewForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                Create New Proposal
              </DialogTitle>
              <DialogDescription>
                Build a professional proposal with AI assistance
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-2">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposal-title">Proposal Title</Label>
                      <Input
                        id="proposal-title"
                        placeholder="e.g., Digital Growth Strategy"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="e.g., Acme Corp"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Client Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="e.g., contact@acmecorp.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* AI Generate Button */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    AI will fill in sections based on client info
                  </span>
                </div>

                <Separator />

                {/* Sections Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Sections</Label>
                    <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs" onClick={addSection}>
                      <Plus className="h-3 w-3" /> Add Section
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {newSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === newSections.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Section title"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            className="h-8 text-sm flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeSection(section.id)}
                            disabled={newSections.length <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Section content..."
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          className="min-h-[80px] text-sm resize-none"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Pricing Table Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Pricing</Label>
                    <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs" onClick={addPricingItem}>
                      <Plus className="h-3 w-3" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newPricing.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-12 gap-2 items-end"
                      >
                        <div className="col-span-12 sm:col-span-4 space-y-1">
                          {index === 0 && <Label className="text-xs text-muted-foreground">Item</Label>}
                          <Input
                            placeholder="Service name"
                            value={item.item}
                            onChange={(e) => updatePricingItem(item.id, 'item', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-3 space-y-1">
                          {index === 0 && <Label className="text-xs text-muted-foreground">Description</Label>}
                          <Input
                            placeholder="Brief description"
                            value={item.description}
                            onChange={(e) => updatePricingItem(item.id, 'description', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2 space-y-1">
                          {index === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updatePricingItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2 space-y-1">
                          {index === 0 && <Label className="text-xs text-muted-foreground">Unit Price</Label>}
                          <Input
                            type="number"
                            min={0}
                            value={item.price || ''}
                            onChange={(e) => updatePricingItem(item.id, 'price', parseInt(e.target.value) || 0)}
                            className="h-8 text-sm"
                            placeholder="$0"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removePricingItem(item.id)}
                            disabled={newPricing.length <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    {/* Total */}
                    <div className="flex items-center justify-end gap-4 pt-2 border-t border-border/60">
                      <span className="text-sm font-medium text-muted-foreground">Total:</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(newPricingTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="flex-row gap-2 pt-2 border-t">
              <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                <Clock className="h-4 w-4" />
                Save as Draft
              </Button>
              <Button onClick={handleSendProposal} className="gap-2">
                <Send className="h-4 w-4" />
                Send Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* ─── Stats Cards ───────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Drafts"
          value={stats.draft}
          color="text-gray-600 dark:text-gray-400"
          bgColor="bg-gray-100 dark:bg-gray-800"
        />
        <StatCard
          icon={<Send className="h-5 w-5" />}
          label="Sent"
          value={stats.sent}
          color="text-teal-600 dark:text-teal-400"
          bgColor="bg-teal-100 dark:bg-teal-950/40"
        />
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Viewed"
          value={stats.viewed}
          color="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-100 dark:bg-amber-950/40"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Accepted"
          value={stats.accepted}
          color="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-100 dark:bg-emerald-950/40"
        />
      </motion.div>

      {/* ─── Filters & Search ──────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'draft', 'sent', 'viewed', 'accepted'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'text-xs gap-1.5',
                statusFilter === status && status !== 'all' && 'bg-emerald-600 hover:bg-emerald-700'
              )}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' && <Filter className="h-3 w-3" />}
              {status !== 'all' && statusConfig[status].icon}
              {status === 'all' ? 'All' : statusConfig[status].label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* ─── Proposal List ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredProposals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/30" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    No proposals found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Create your first proposal to get started'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 border-border/50"
                  onClick={() => openDetail(proposal)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FileText className="h-5 w-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {proposal.title}
                          </h3>
                          <StatusBadge status={proposal.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {proposal.clientName}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {proposal.clientEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Value & Arrow */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(proposal.totalValue)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {proposal.pricing.length} line item{proposal.pricing.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Detail Sheet ──────────────────────────────────────────────────── */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl p-0 overflow-hidden flex flex-col">
          {selectedProposal && (
            <>
              {/* Sheet Header */}
              <div className="border-b border-border/60 bg-muted/30 p-4 sm:p-6">
                <SheetHeader className="space-y-2">
                  <div className="flex items-center justify-between pr-8">
                    <SheetTitle className="text-lg font-bold">
                      {selectedProposal.title}
                    </SheetTitle>
                    <StatusBadge status={selectedProposal.status} />
                  </div>
                  <SheetDescription className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {selectedProposal.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedProposal.clientEmail}
                    </span>
                  </SheetDescription>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() => {
                        setIsEditing(!isEditing)
                        if (!isEditing) {
                          setEditSections(selectedProposal.sections.map((s) => ({ ...s })))
                          setEditPricing(selectedProposal.pricing.map((p) => ({ ...p })))
                        }
                      }}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      {isEditing ? 'Preview' : 'Edit'}
                    </Button>
                    {selectedProposal.status === 'draft' && (
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => handleSendExisting(selectedProposal)}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() => handleShare(selectedProposal)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() => handleExportPdf(selectedProposal)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export PDF
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{selectedProposal.title}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => handleDelete(selectedProposal.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </SheetHeader>
              </div>

              {/* Sheet Body */}
              <ScrollArea className="flex-1">
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Status Timeline */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Clock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        Status Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StatusTimeline proposal={selectedProposal} />
                    </CardContent>
                  </Card>

                  {isEditing ? (
                    /* ─── Edit Mode ─────────────────────────────────────────── */
                    <div className="space-y-6">
                      {/* Sections Editor */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold">Edit Sections</CardTitle>
                            <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs" onClick={addEditSection}>
                              <Plus className="h-3 w-3" /> Add Section
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {editSections.map((section, index) => (
                            <div
                              key={section.id}
                              className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveEditSection(section.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveEditSection(section.id, 'down')}
                                    disabled={index === editSections.length - 1}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Input
                                  placeholder="Section title"
                                  value={section.title}
                                  onChange={(e) => updateEditSection(section.id, 'title', e.target.value)}
                                  className="h-8 text-sm flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeEditSection(section.id)}
                                  disabled={editSections.length <= 1}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Section content..."
                                value={section.content}
                                onChange={(e) => updateEditSection(section.id, 'content', e.target.value)}
                                className="min-h-[80px] text-sm resize-none"
                              />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Pricing Editor */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold">Edit Pricing</CardTitle>
                            <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs" onClick={addEditPricingItem}>
                              <Plus className="h-3 w-3" /> Add Item
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {editPricing.map((item, index) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-12 gap-2 items-end"
                            >
                              <div className="col-span-12 sm:col-span-4 space-y-1">
                                {index === 0 && <Label className="text-xs text-muted-foreground">Item</Label>}
                                <Input
                                  placeholder="Service name"
                                  value={item.item}
                                  onChange={(e) => updateEditPricingItem(item.id, 'item', e.target.value)}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="col-span-12 sm:col-span-3 space-y-1">
                                {index === 0 && <Label className="text-xs text-muted-foreground">Description</Label>}
                                <Input
                                  placeholder="Brief description"
                                  value={item.description}
                                  onChange={(e) => updateEditPricingItem(item.id, 'description', e.target.value)}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="col-span-4 sm:col-span-2 space-y-1">
                                {index === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => updateEditPricingItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="col-span-6 sm:col-span-2 space-y-1">
                                {index === 0 && <Label className="text-xs text-muted-foreground">Unit Price</Label>}
                                <Input
                                  type="number"
                                  min={0}
                                  value={item.price || ''}
                                  onChange={(e) => updateEditPricingItem(item.id, 'price', parseInt(e.target.value) || 0)}
                                  className="h-8 text-sm"
                                  placeholder="$0"
                                />
                              </div>
                              <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeEditPricingItem(item.id)}
                                  disabled={editPricing.length <= 1}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center justify-end gap-4 pt-2 border-t border-border/60">
                            <span className="text-sm font-medium text-muted-foreground">Total:</span>
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(editPricingTotal)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Save Button */}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setEditSections(selectedProposal.sections.map((s) => ({ ...s })))
                            setEditPricing(selectedProposal.pricing.map((p) => ({ ...p })))
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ─── Preview Mode ──────────────────────────────────────── */
                    <ProposalPreviewCard proposal={selectedProposal} />
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
