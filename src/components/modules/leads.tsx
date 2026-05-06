'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Globe,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  FileText,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Trash2,
  Send,
  StickyNote,
  X,
  GripVertical,
  Tag,
  Clock,
  Activity,
} from 'lucide-react'

import { cn, formatCurrency } from '@/lib/utils'
import { containerVariants, itemVariants } from '@/lib/animations'
import { demoLeads } from '@/lib/demo-data'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ─── Types ──────────────────────────────────────────────────────────────────

interface LeadNote {
  id: string
  text: string
  createdAt: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  title: string
  source: string
  status: string
  score: number
  value: number
  tags: string[]
  website: string
  lastContactAt: string | null
  createdAt: string
  notes?: LeadNote[]
}

type ViewMode = 'table' | 'kanban'
type SortField = 'name' | 'company' | 'value' | 'score' | 'lastContactAt' | 'createdAt'
type SortDirection = 'asc' | 'desc'

// ─── Pipeline Stages Config ─────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { id: 'new', label: 'New', color: 'bg-slate-500', lightColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', headerBg: 'from-slate-500/20 to-slate-500/5' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500', lightColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', headerBg: 'from-amber-500/20 to-amber-500/5' },
  { id: 'qualified', label: 'Qualified', color: 'bg-teal-500', lightColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', headerBg: 'from-teal-500/20 to-teal-500/5' },
  { id: 'proposal', label: 'Proposal', color: 'bg-cyan-500', lightColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', headerBg: 'from-cyan-500/20 to-cyan-500/5' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500', lightColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', headerBg: 'from-orange-500/20 to-orange-500/5' },
  { id: 'won', label: 'Won', color: 'bg-emerald-500', lightColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', headerBg: 'from-emerald-500/20 to-emerald-500/5' },
  { id: 'lost', label: 'Lost', color: 'bg-rose-500', lightColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', headerBg: 'from-rose-500/20 to-rose-500/5' },
]

const SOURCE_OPTIONS = ['website', 'referral', 'linkedin', 'cold', 'event']
const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusConfig(status: string) {
  return PIPELINE_STAGES.find(s => s.id === status) || PIPELINE_STAGES[0]
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-teal-600 dark:text-teal-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-teal-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

function getSourceIcon(source: string) {
  switch (source) {
    case 'website': return <Globe className="size-3" />
    case 'referral': return <Users className="size-3" />
    case 'linkedin': return <Building2 className="size-3" />
    case 'cold': return <Send className="size-3" />
    case 'event': return <Sparkles className="size-3" />
    default: return <Globe className="size-3" />
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

// ─── Sortable Kanban Card ───────────────────────────────────────────────────

function KanbanLeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: { lead } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const statusConfig = getStatusConfig(lead.status)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'group relative rounded-lg border border-border/50 bg-card p-3 cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-border hover:-translate-y-0.5',
        isDragging && 'opacity-50 shadow-lg rotate-2 scale-105 z-50',
      )}
      onClick={onClick}
      layout
      layoutId={lead.id}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-3.5 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-2.5">
        <Avatar className="size-8 shrink-0 border border-border/50">
          <AvatarFallback className={cn('text-[10px] font-semibold', statusConfig.lightColor)}>
            {getInitials(lead.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate pr-5">{lead.name}</p>
          <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{formatCurrency(lead.value)}</span>
        <div className="flex items-center gap-1.5">
          <div className={cn('h-1.5 w-12 rounded-full bg-muted overflow-hidden')}>
            <div className={cn('h-full rounded-full transition-all', getScoreBgColor(lead.score))} style={{ width: `${lead.score}%` }} />
          </div>
          <span className={cn('text-[10px] font-medium', getScoreColor(lead.score))}>{lead.score}</span>
        </div>
      </div>

      {lead.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {lead.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
          {lead.tags.length > 2 && (
            <span className="inline-flex items-center rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{lead.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ─── Kanban Column ──────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  leads,
  onLeadClick,
  onAddLead,
  isCollapsed,
  onToggleCollapse,
}: {
  stage: typeof PIPELINE_STAGES[number]
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
  onAddLead: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}) {
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0)

  return (
    <div className={cn('flex flex-col shrink-0 snap-start', isCollapsed ? 'min-w-[48px] w-[48px]' : 'min-w-[280px] w-[280px]')}>
      {/* Column header */}
      <div className={cn('bg-gradient-to-b p-3 border border-border/50', isCollapsed ? 'rounded-xl border-b' : 'rounded-t-xl border-b-0', stage.headerBg)}>
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center gap-2', isCollapsed && 'flex-col')}>
            <div className={cn('size-2.5 rounded-full', stage.color)} />
            {!isCollapsed && (
              <>
                <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-background/80 text-[11px] font-medium text-muted-foreground">
                  {leads.length}
                </span>
              </>
            )}
            {isCollapsed && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-background/80 text-[11px] font-medium text-muted-foreground [writing-mode:vertical-rl]">
                {leads.length}
              </span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddLead}>Add lead</DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleCollapse}>{isCollapsed ? 'Expand column' : 'Collapse column'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isCollapsed && <p className="mt-1 text-xs text-muted-foreground">{formatCurrency(totalValue)}</p>}
      </div>

      {/* Column body */}
      {!isCollapsed && (
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="flex-1 space-y-2 rounded-b-xl border border-border/50 border-t-0 bg-muted/20 p-2 min-h-[200px] max-h-[calc(100vh-360px)] overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {leads.map((lead) => (
                <KanbanLeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
              ))}
            </AnimatePresence>
            {leads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="size-6 mb-1 opacity-30" />
                <p className="text-xs">No leads</p>
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

// ─── Main Leads Module ──────────────────────────────────────────────────────

export default function LeadsModule() {
  // Store
  const { setCurrentPage, addNotification } = useAppStore()

  // State
  const [leads, setLeads] = useState<Lead[]>(demoLeads as Lead[])
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  // Add lead form state
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website',
    value: '',
  })

  // Notes state for detail sheet
  const [noteText, setNoteText] = useState('')

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    let result = [...leads]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q)
      )
    }

    if (sourceFilter !== 'all') {
      result = result.filter(l => l.source === sourceFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter)
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortField] as string | number
      let bVal: string | number = b[sortField] as string | number

      if (sortField === 'lastContactAt' || sortField === 'createdAt') {
        aVal = aVal ? new Date(aVal as string).getTime() : 0
        bVal = bVal ? new Date(bVal as string).getTime() : 0
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (sortDirection === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    })

    return result
  }, [leads, searchQuery, sourceFilter, statusFilter, sortField, sortDirection])

  // Stats
  const stats = useMemo(() => {
    const total = leads.length
    const qualified = leads.filter(l => l.status === 'qualified').length
    const inPipeline = leads.filter(l => !['won', 'lost'].includes(l.status)).length
    const won = leads.filter(l => l.status === 'won')
    const wonCount = won.length
    const wonValue = won.reduce((s, l) => s + l.value, 0)
    return { total, qualified, inPipeline, wonCount, wonValue }
  }, [leads])

  // Kanban leads by stage
  const kanbanLeads = useMemo(() => {
    const map: Record<string, Lead[]> = {}
    PIPELINE_STAGES.forEach(stage => {
      map[stage.id] = filteredLeads.filter(l => l.status === stage.id)
    })
    return map
  }, [filteredLeads])

  // Handlers
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  const handleAddLead = useCallback(() => {
    if (!newLead.name || !newLead.email) return
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || '',
      company: newLead.company || '',
      title: '',
      source: newLead.source,
      status: 'new',
      score: 30,
      value: Number(newLead.value) || 0,
      tags: [],
      website: '',
      lastContactAt: null,
      createdAt: new Date().toISOString(),
    }
    setLeads(prev => [lead, ...prev])
    setNewLead({ name: '', email: '', phone: '', company: '', title: '', source: 'website', value: '' })
    setAddDialogOpen(false)
  }, [newLead])

  const handleDeleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id))
    setDetailOpen(false)
    setSelectedLead(null)
  }, [])

  const handleLeadClick = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setDetailOpen(true)
  }, [])

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveLeadId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeLead = leads.find(l => l.id === active.id)
    if (!activeLead) return

    // Determine the target stage
    let targetStage: string | null = null

    // Check if over another lead
    const overLead = leads.find(l => l.id === over.id)
    if (overLead) {
      targetStage = overLead.status
    } else {
      // Check if over a container (stage id)
      const stageId = PIPELINE_STAGES.find(s => s.id === over.id)
      if (stageId) {
        targetStage = stageId.id
      }
    }

    if (targetStage && activeLead.status !== targetStage) {
      setLeads(prev =>
        prev.map(l =>
          l.id === active.id ? { ...l, status: targetStage! } : l
        )
      )
    }
  }, [leads])

  const handleDragEnd = useCallback((_event: DragEndEvent) => {
    setActiveLeadId(null)
  }, [])

  const activeLead = activeLeadId ? leads.find(l => l.id === activeLeadId) : null

  return (
    <TooltipProvider>
      <motion.div
        className="space-y-6 p-4 md:p-6 lg:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads CRM</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your pipeline and track lead progress from first touch to close.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <UserPlus className="size-4" />
                  <span className="hidden sm:inline">Add Lead</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>Enter the details for the new lead.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-name">Full Name *</Label>
                      <Input
                        id="lead-name"
                        placeholder="John Smith"
                        value={newLead.name}
                        onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-email">Email *</Label>
                      <Input
                        id="lead-email"
                        type="email"
                        placeholder="john@company.com"
                        value={newLead.email}
                        onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-phone">Phone</Label>
                      <Input
                        id="lead-phone"
                        placeholder="+1 (555) 000-0000"
                        value={newLead.phone}
                        onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-company">Company</Label>
                      <Input
                        id="lead-company"
                        placeholder="Acme Inc"
                        value={newLead.company}
                        onChange={e => setNewLead(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-title">Title</Label>
                      <Input
                        id="lead-title"
                        placeholder="VP of Marketing"
                        value={newLead.title}
                        onChange={e => setNewLead(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-source">Source</Label>
                      <Select value={newLead.source} onValueChange={v => setNewLead(p => ({ ...p, source: v }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="cold">Cold Outreach</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-value">Estimated Value ($)</Label>
                    <Input
                      id="lead-value"
                      type="number"
                      placeholder="10000"
                      value={newLead.value}
                      onChange={e => setNewLead(p => ({ ...p, value: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddLead} disabled={!newLead.name || !newLead.email} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Add Lead
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="size-9" onClick={() => setImportDialogOpen(true)}>
                  <Upload className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import Leads</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="size-9" onClick={() => {
                  const headers = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Source', 'Status', 'Score', 'Value']
                  const csvRows = [
                    headers.join(','),
                    ...leads.map(l => [l.name, l.email, l.phone || '', l.company || '', l.title || '', l.source, l.status, l.score, l.value].map(v => `"${v}"`).join(','))
                  ]
                  const csvContent = csvRows.join('\n')
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
                  link.click()
                  URL.revokeObjectURL(url)
                  toast.success('Leads Exported', { description: `Exported ${leads.length} leads to CSV` })
                }}>
                  <Download className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Leads</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* ─── Import Dialog ──────────────────────────────────────────────── */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Import Leads</DialogTitle>
              <DialogDescription>Upload a CSV file to import leads into your pipeline.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="csv-upload">CSV File</Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={() => {
                    const mockCount = Math.floor(Math.random() * 20) + 5
                    toast.success('Import Complete', { description: `Imported ${mockCount} leads from CSV` })
                    setImportDialogOpen(false)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Expected columns: Name, Email, Phone, Company, Title, Source, Status, Score, Value
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Stats Bar ───────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-teal-500/10">
                  <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stats.qualified}</p>
                  <p className="text-xs text-muted-foreground">Qualified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <TrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stats.inPipeline}</p>
                  <p className="text-xs text-muted-foreground">In Pipeline</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10">
                  <DollarSign className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{stats.wonCount}</p>
                  <p className="text-xs text-muted-foreground">Won ({formatCurrency(stats.wonValue)})</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── View Toggle + Filters ───────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-[3px]">
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-all',
                  viewMode === 'kanban'
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="size-3.5" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-all',
                  viewMode === 'table'
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="size-3.5" />
                Table
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 w-full sm:w-[200px] pl-8 text-sm"
              />
            </div>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[130px] text-sm">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCE_OPTIONS.map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s === 'cold' ? 'Cold Outreach' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || sourceFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => { setSearchQuery(''); setSourceFilter('all'); setStatusFilter('all') }}
              >
                <X className="size-3" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* ─── Content ─────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[250px]">
                          <button className="inline-flex items-center gap-0 hover:text-foreground transition-colors" onClick={() => handleSort('name')}>
                            Name {sortField === 'name' ? (sortDirection === 'asc' ? <ChevronUp className="size-3 ml-1 text-primary" /> : <ChevronDown className="size-3 ml-1 text-primary" />) : <ArrowUpDown className="size-3 ml-1 text-muted-foreground/50" />}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button className="inline-flex items-center gap-0 hover:text-foreground transition-colors" onClick={() => handleSort('company')}>
                            Company {sortField === 'company' ? (sortDirection === 'asc' ? <ChevronUp className="size-3 ml-1 text-primary" /> : <ChevronDown className="size-3 ml-1 text-primary" />) : <ArrowUpDown className="size-3 ml-1 text-muted-foreground/50" />}
                          </button>
                        </TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <button className="inline-flex items-center gap-0 hover:text-foreground transition-colors" onClick={() => handleSort('score')}>
                            Score {sortField === 'score' ? (sortDirection === 'asc' ? <ChevronUp className="size-3 ml-1 text-primary" /> : <ChevronDown className="size-3 ml-1 text-primary" />) : <ArrowUpDown className="size-3 ml-1 text-muted-foreground/50" />}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button className="inline-flex items-center gap-0 hover:text-foreground transition-colors" onClick={() => handleSort('value')}>
                            Value {sortField === 'value' ? (sortDirection === 'asc' ? <ChevronUp className="size-3 ml-1 text-primary" /> : <ChevronDown className="size-3 ml-1 text-primary" />) : <ArrowUpDown className="size-3 ml-1 text-muted-foreground/50" />}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button className="inline-flex items-center gap-0 hover:text-foreground transition-colors" onClick={() => handleSort('lastContactAt')}>
                            Last Contact {sortField === 'lastContactAt' ? (sortDirection === 'asc' ? <ChevronUp className="size-3 ml-1 text-primary" /> : <ChevronDown className="size-3 ml-1 text-primary" />) : <ArrowUpDown className="size-3 ml-1 text-muted-foreground/50" />}
                          </button>
                        </TableHead>
                        <TableHead className="w-[50px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Search className="size-8 opacity-30" />
                              <p className="text-sm">No leads found</p>
                              <p className="text-xs">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => {
                          const statusConfig = getStatusConfig(lead.status)
                          return (
                            <TableRow
                              key={lead.id}
                              className="cursor-pointer group"
                              onClick={() => handleLeadClick(lead)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-8 border border-border/50">
                                    <AvatarFallback className={cn('text-[10px] font-semibold', statusConfig.lightColor)}>
                                      {getInitials(lead.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{lead.name}</p>
                                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="size-3 text-muted-foreground" />
                                  <span className="text-sm">{lead.company}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  {getSourceIcon(lead.source)}
                                  <span className="text-sm capitalize">{lead.source === 'cold' ? 'Cold Outreach' : lead.source}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={cn('text-[10px] font-medium border-0', statusConfig.lightColor)}>
                                  {statusConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={cn('h-full rounded-full transition-all', getScoreBgColor(lead.score))}
                                      style={{ width: `${lead.score}%` }}
                                    />
                                  </div>
                                  <span className={cn('text-xs font-medium tabular-nums', getScoreColor(lead.score))}>
                                    {lead.score}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-medium">{formatCurrency(lead.value)}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs text-muted-foreground">
                                  {lead.lastContactAt
                                    ? formatDistanceToNow(new Date(lead.lastContactAt), { addSuffix: true })
                                    : 'Never'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="size-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleLeadClick(lead) }}>View Details</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`mailto:${lead.email}?subject=Following up`, '_blank') }}>Send Email</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setCurrentPage('proposals'); addNotification({ title: 'Create Proposal', message: `Creating proposal for ${lead.name} from ${lead.company}`, type: 'info' }) }}>Create Proposal</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id) }}
                                    >
                                      Delete Lead
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                  {PIPELINE_STAGES.map(stage => (
                    <KanbanColumn
                      key={stage.id}
                      stage={stage}
                      leads={kanbanLeads[stage.id] || []}
                      onLeadClick={handleLeadClick}
                      onAddLead={() => {
                        setNewLead(p => ({ ...p, source: stage.id === 'new' ? p.source : p.source }))
                        setAddDialogOpen(true)
                      }}
                      isCollapsed={collapsedColumns.has(stage.id)}
                      onToggleCollapse={() => {
                        setCollapsedColumns(prev => {
                          const next = new Set(prev)
                          if (next.has(stage.id)) {
                            next.delete(stage.id)
                          } else {
                            next.add(stage.id)
                          }
                          return next
                        })
                      }}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeLead ? (
                    <div className="rounded-lg border border-border bg-card p-3 shadow-xl w-[260px] rotate-2">
                      <div className="flex items-start gap-2.5">
                        <Avatar className="size-8 shrink-0 border border-border/50">
                          <AvatarFallback className={cn('text-[10px] font-semibold', getStatusConfig(activeLead.status).lightColor)}>
                            {getInitials(activeLead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{activeLead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{activeLead.company}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">{formatCurrency(activeLead.value)}</span>
                        <span className={cn('text-xs font-medium', getScoreColor(activeLead.score))}>{activeLead.score}</span>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Lead Detail Sheet ───────────────────────────────────────────── */}
        <Sheet open={detailOpen} onOpenChange={(open) => { setDetailOpen(open); if (!open) setSelectedLead(null) }}>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            {selectedLead && (() => {
              const currentLead = leads.find(l => l.id === selectedLead.id) || selectedLead
              const statusConfig = getStatusConfig(currentLead.status)
              return (
                <div className="space-y-6 pb-8">
                  <SheetHeader className="space-y-3 p-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12 border-2 border-border/50">
                        <AvatarFallback className={cn('text-sm font-semibold', statusConfig.lightColor)}>
                          {getInitials(currentLead.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <SheetTitle className="text-lg">{currentLead.name}</SheetTitle>
                        <SheetDescription className="text-sm">{currentLead.title} at {currentLead.company}</SheetDescription>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="secondary" className={cn('text-[10px] font-medium border-0', statusConfig.lightColor)}>
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize gap-1">
                            {getSourceIcon(currentLead.source)}
                            {currentLead.source === 'cold' ? 'Cold Outreach' : currentLead.source}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </SheetHeader>

                  <Separator />

                  {/* Score Visualization */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Activity className="size-4 text-emerald-500" />
                      Lead Score
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold tracking-tight">{currentLead.score}</span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      <Progress value={currentLead.score} className={cn('h-3', currentLead.score >= 80 ? '[&>div]:bg-emerald-500' : currentLead.score >= 60 ? '[&>div]:bg-teal-500' : currentLead.score >= 40 ? '[&>div]:bg-amber-500' : '[&>div]:bg-rose-500')} />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Cold</span>
                        <span>Warm</span>
                        <span>Hot</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Users className="size-4 text-emerald-500" />
                      Contact Information
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                        <Mail className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{currentLead.email}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                        <Phone className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{currentLead.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                        <Building2 className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{currentLead.company}</span>
                      </div>
                      {currentLead.website && (
                        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                          <Globe className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-primary hover:underline cursor-pointer">{currentLead.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Deal Value */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="size-4 text-emerald-500" />
                      Deal Value
                    </h4>
                    <div className="rounded-lg bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/20 p-4">
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(currentLead.value)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Estimated deal value</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Tags */}
                  {currentLead.tags.length > 0 && (
                    <>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Tag className="size-4 text-emerald-500" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {currentLead.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs border-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <StickyNote className="size-4 text-emerald-500" />
                      Notes
                    </h4>
                    <div className="space-y-2">
                      {(currentLead.notes || []).map(note => (
                        <div key={note.id} className="rounded-lg bg-muted/50 p-2.5 border border-border/50">
                          <p className="text-sm text-foreground">{note.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                      <Textarea
                        placeholder="Add a note about this lead..."
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        className="min-h-[80px] resize-none text-sm"
                      />
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs" disabled={!noteText.trim()}
                        onClick={() => {
                          if (!noteText.trim()) return
                          const updatedLeads = leads.map(l =>
                            l.id === selectedLead.id
                              ? { ...l, notes: [...(l.notes || []), { id: `note-${Date.now()}`, text: noteText, createdAt: new Date().toISOString() }] }
                              : l
                          )
                          setLeads(updatedLeads)
                          setNoteText('')
                          toast.success('Note Saved', { description: 'Note added to lead' })
                        }}
                      >
                        <StickyNote className="size-3" />
                        Save Note
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Activity History */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="size-4 text-emerald-500" />
                      Activity Timeline
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                          <div className="w-px flex-1 bg-border" />
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">Lead created</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(currentLead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {currentLead.lastContactAt && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="size-2 rounded-full bg-teal-500 mt-1.5" />
                            <div className="w-px flex-1 bg-border" />
                          </div>
                          <div className="pb-4">
                            <p className="text-sm font-medium">Last contact</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(currentLead.lastContactAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn('size-2 rounded-full mt-1.5', statusConfig.color)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Moved to {statusConfig.label}</p>
                          <p className="text-xs text-muted-foreground">Status updated</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                      onClick={() => window.open(`mailto:${currentLead.email}?subject=Following up from Growth Agency`, '_blank')}
                    >
                      <Mail className="size-4" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="gap-2 w-full"
                      onClick={() => {
                        setCurrentPage('proposals')
                        addNotification({ title: 'Create Proposal', message: `Creating proposal for ${currentLead.name} from ${currentLead.company}`, type: 'info' })
                      }}
                    >
                      <FileText className="size-4" />
                      Create Proposal
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2 flex-1"
                        onClick={() => window.open(`mailto:${currentLead.email}?subject=Re: Following up from Growth Agency`, '_blank')}
                      >
                        <Send className="size-4" />
                        Quick Reply
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteLead(currentLead.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </SheetContent>
        </Sheet>
      </motion.div>
    </TooltipProvider>
  )
}
