'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function OutreachModule() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outreach</h1>
          <p className="text-sm text-muted-foreground">AI-powered outreach campaigns</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outreach Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Send className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">Outreach module coming soon</p>
            <p className="text-xs mt-1">This module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
