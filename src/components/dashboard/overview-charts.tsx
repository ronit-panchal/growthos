'use client'

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type PipelineStage = {
  stage: string
  count: number
}

type TrendPoint = {
  label: string
  leads: number
  audits: number
  proposals: number
}

type ActivityType = {
  type: string
  count: number
}

type OverviewChartsProps = {
  pipeline: PipelineStage[]
  trend: TrendPoint[]
  activityMix: ActivityType[]
}

const chartConfig = {
  leads: { label: 'Leads', color: 'var(--color-chart-1)' },
  audits: { label: 'Audits', color: 'var(--color-chart-2)' },
  proposals: { label: 'Proposals', color: 'var(--color-chart-3)' },
  count: { label: 'Count', color: 'var(--color-chart-1)' },
} as const

const pieColors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-primary)',
]

export function OverviewCharts({ pipeline, trend, activityMix }: OverviewChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr_.8fr]">
      <Card className="border-white/10 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Pipeline Health</CardTitle>
          <CardDescription>See where your leads are collecting momentum.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={pipeline}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="var(--color-count)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>6-Month Velocity</CardTitle>
          <CardDescription>Track how pipeline creation translates into delivery work.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart data={trend}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Line type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="audits" stroke="var(--color-audits)" strokeWidth={3} dot={false} />
              <Line
                type="monotone"
                dataKey="proposals"
                stroke="var(--color-proposals)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Execution Mix</CardTitle>
          <CardDescription>Which workflows your workspace uses most.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={activityMix} dataKey="count" nameKey="type" innerRadius={58} outerRadius={84} paddingAngle={3}>
                {activityMix.map((entry, index) => (
                  <Cell key={entry.type} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="space-y-2 text-sm">
            {activityMix.map((entry, index) => (
              <div key={entry.type} className="flex items-center justify-between rounded-2xl border border-white/8 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="capitalize text-muted-foreground">{entry.type.replaceAll('_', ' ')}</span>
                </div>
                <span className="font-medium">{entry.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
