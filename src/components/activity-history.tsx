'use client'

import { useState, useEffect } from 'react'
import { 
  Target, 
  SearchCheck, 
  FileText, 
  Megaphone, 
  Users, 
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'lead' | 'audit' | 'proposal' | 'outreach' | 'user' | 'system'
  title: string
  description: string | null
  createdAt: string
  metadata?: any
}

const activityIcons: Record<string, any> = {
  lead: Target,
  lead_created: Target,
  audit: SearchCheck,
  audit_started: SearchCheck,
  proposal: FileText,
  proposal_created: FileText,
  outreach: Megaphone,
  outreach_created: Megaphone,
  user: Users,
  system: CheckCircle,
}

const activityColors: Record<string, string> = {
  lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  lead_created: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  audit: 'bg-green-500/10 text-green-600 dark:text-green-400',
  audit_started: 'bg-green-500/10 text-green-600 dark:text-green-400',
  proposal: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  proposal_created: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  outreach: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  outreach_created: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  user: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  system: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

// Map activity types to simpler categories for filtering
function getActivityCategory(type: string): string {
  if (type.includes('lead')) return 'lead'
  if (type.includes('audit')) return 'audit'
  if (type.includes('proposal')) return 'proposal'
  if (type.includes('outreach')) return 'outreach'
  if (type.includes('user')) return 'user'
  return 'system'
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 7200) return '1 hour ago'
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 172800) return 'Yesterday'
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatFullDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface ActivityHistoryProps {
  limit?: number
  showViewAll?: boolean
  detailed?: boolean
}

export function ActivityHistory({ limit = 10, showViewAll = true, detailed = false }: ActivityHistoryProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activities?limit=${limit * 2}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayActivities = expanded ? activities : activities.slice(0, limit)

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/8 px-4 py-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 px-4 py-10 text-center">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Start by adding a lead or running an audit
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => {
        const Icon = activityIcons[activity.type] || CheckCircle
        const colorClass = activityColors[activity.type] || activityColors.system
        
        return (
          <div 
            key={activity.id} 
            className={`rounded-3xl border border-white/8 px-4 py-3 transition hover:border-white/20 ${detailed ? 'bg-card/50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-xl p-2 h-fit ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                    {detailed && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                        {formatFullDateTime(activity.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                )}
                {detailed && activity.metadata && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {!expanded && activities.length > limit && (
        <Button 
          variant="ghost" 
          className="w-full rounded-full text-sm"
          onClick={() => setExpanded(true)}
        >
          Show {activities.length - limit} more activities
        </Button>
      )}
      
      {showViewAll && (
        <Button variant="outline" className="w-full rounded-full text-sm" asChild>
          <Link href="/dashboard/history">
            View Full History <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  )
}

export function ActivitySummary() {
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  })

  useEffect(() => {
    fetchActivityStats()
  }, [])

  const fetchActivityStats = async () => {
    try {
      const response = await fetch('/api/activities?limit=100')
      if (response.ok) {
        const data = await response.json()
        const activities = data.activities || []
        
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        setStats({
          today: activities.filter((a: Activity) => new Date(a.createdAt) >= today).length,
          thisWeek: activities.filter((a: Activity) => new Date(a.createdAt) >= weekAgo).length,
          thisMonth: activities.filter((a: Activity) => new Date(a.createdAt) >= monthAgo).length,
        })
      }
    } catch (error) {
      console.error('Failed to fetch activity stats:', error)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">{stats.today}</div>
        <p className="text-xs text-muted-foreground">Today</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{stats.thisWeek}</div>
        <p className="text-xs text-muted-foreground">This Week</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{stats.thisMonth}</div>
        <p className="text-xs text-muted-foreground">This Month</p>
      </div>
    </div>
  )
}

export function ActivityTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-800',
    lead_created: 'bg-blue-100 text-blue-800',
    audit: 'bg-green-100 text-green-800',
    audit_started: 'bg-green-100 text-green-800',
    proposal: 'bg-orange-100 text-orange-800',
    proposal_created: 'bg-orange-100 text-orange-800',
    outreach: 'bg-purple-100 text-purple-800',
    outreach_created: 'bg-purple-100 text-purple-800',
    user: 'bg-gray-100 text-gray-800',
    system: 'bg-emerald-100 text-emerald-800',
  }
  
  const category = getActivityCategory(type)
  
  return (
    <Badge className={`${colors[type] || colors.system} capitalize`}>
      {category}
    </Badge>
  )
}
