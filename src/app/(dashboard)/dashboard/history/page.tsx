'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  Filter, 
  Download,
  Target,
  SearchCheck,
  FileText,
  Megaphone,
  Users,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Activity {
  id: string
  type: 'lead' | 'audit' | 'proposal' | 'outreach' | 'user' | 'system'
  title: string
  description: string | null
  createdAt: string
  metadata?: any
}

const activityIcons = {
  lead: Target,
  audit: SearchCheck,
  proposal: FileText,
  outreach: Megaphone,
  user: Users,
  system: CheckCircle,
}

const activityColors = {
  lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  audit: 'bg-green-500/10 text-green-600 dark:text-green-400',
  proposal: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  outreach: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  user: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  system: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 7200) return '1 hour ago'
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 172800) return 'Yesterday'
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function groupByDate(activities: Activity[]) {
  const groups: { [key: string]: Activity[] } = {}
  
  activities.forEach(activity => {
    const date = new Date(activity.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let key: string
    
    if (date.toDateString() === today.toDateString()) {
      key = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday'
    } else {
      key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    
    if (!groups[key]) groups[key] = []
    groups[key].push(activity)
  })
  
  return groups
}

export default function HistoryPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  })

  useEffect(() => {
    fetchActivities()
  }, [])

  // Helper to get activity category
  const getActivityCategory = (type: string): string => {
    if (type.includes('lead')) return 'lead'
    if (type.includes('audit')) return 'audit'
    if (type.includes('proposal')) return 'proposal'
    if (type.includes('outreach')) return 'outreach'
    if (type.includes('user')) return 'user'
    return 'system'
  }

  useEffect(() => {
    let filtered = activities
    
    if (filter !== 'all') {
      filtered = filtered.filter(a => getActivityCategory(a.type) === filter)
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(term) ||
        (a.description && a.description.toLowerCase().includes(term))
      )
    }
    
    setFilteredActivities(filtered)
  }, [activities, filter, searchTerm])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities?limit=200')
      if (response.ok) {
        const data = await response.json()
        const acts = data.activities || []
        setActivities(acts)
        setFilteredActivities(acts)
        
        // Calculate stats
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        setStats({
          today: acts.filter((a: Activity) => new Date(a.createdAt) >= today).length,
          thisWeek: acts.filter((a: Activity) => new Date(a.createdAt) >= weekAgo).length,
          thisMonth: acts.filter((a: Activity) => new Date(a.createdAt) >= monthAgo).length,
          total: acts.length,
        })
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportHistory = () => {
    const csvContent = [
      ['Date', 'Time', 'Type', 'Title', 'Description'].join(','),
      ...activities.map(a => [
        new Date(a.createdAt).toLocaleDateString(),
        new Date(a.createdAt).toLocaleTimeString(),
        a.type,
        `"${a.title.replace(/"/g, '""')}"`,
        `"${(a.description || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const groupedActivities = groupByDate(filteredActivities)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchActivities} className="rounded-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportHistory} className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground mt-1">
          Track everything you've done in GrowthOS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-3xl">{stats.today}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">{stats.thisWeek}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">{stats.thisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'lead', 'audit', 'proposal', 'outreach'].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="rounded-full capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            {filteredActivities.length} {filter !== 'all' ? filter : ''} activities found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-3xl border border-white/8 px-4 py-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted rounded mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start using GrowthOS to see your activity history'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([date, acts]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 sticky top-0 bg-card py-2">
                    {date}
                  </h3>
                  <div className="space-y-3">
                    {acts.map((activity) => {
                      const Icon = activityIcons[activity.type] || CheckCircle
                      const colorClass = activityColors[activity.type] || activityColors.system
                      
                      return (
                        <div 
                          key={activity.id} 
                          className="rounded-3xl border border-white/8 px-4 py-4 hover:border-white/20 transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`rounded-xl p-3 h-fit ${colorClass}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium">{activity.title}</p>
                                  <Badge variant="outline" className="mt-1 capitalize text-xs">
                                    {getActivityCategory(activity.type)}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatRelativeTime(activity.createdAt)}
                                </span>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {activity.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDateTime(activity.createdAt)}
                              </p>
                              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {Object.entries(activity.metadata).slice(0, 4).map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="text-xs">
                                      {key}: {String(value).substring(0, 20)}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
