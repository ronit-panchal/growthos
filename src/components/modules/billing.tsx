'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Crown,
  Check,
  X,
  Download,
  CreditCard,
  Sparkles,
  Users,
  HardDrive,
  Zap,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { containerVariants, itemVariants } from '@/lib/animations'
import { demoPlans } from '@/lib/demo-data'
import { useAppStore } from '@/lib/store'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

// ─── Mock Invoice Data ────────────────────────────────────────────────────────

const mockInvoices = [
  { id: 'INV-2024-001', date: '2024-12-01', description: 'Pro Plan - Monthly', amount: 129.00, status: 'paid' as const },
  { id: 'INV-2024-002', date: '2024-11-01', description: 'Pro Plan - Monthly', amount: 129.00, status: 'paid' as const },
  { id: 'INV-2024-003', date: '2024-10-01', description: 'Pro Plan - Monthly', amount: 129.00, status: 'paid' as const },
  { id: 'INV-2024-004', date: '2024-09-01', description: 'Pro Plan - Monthly + Addon Credits', amount: 179.00, status: 'paid' as const },
  { id: 'INV-2024-005', date: '2024-08-01', description: 'Pro Plan - Monthly', amount: 129.00, status: 'pending' as const },
  { id: 'INV-2024-006', date: '2024-07-01', description: 'Starter Plan - Monthly', amount: 49.00, status: 'paid' as const },
]

// ─── Payment Dialog ───────────────────────────────────────────────────────────

function PaymentDialog({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: (typeof demoPlans)[0] | null
}) {
  const [processing, setProcessing] = useState(false)

  if (!plan) return null

  const handlePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onOpenChange(false)
      toast.success('Demo mode: Payment simulated', {
        description: `${plan.name} plan activated successfully!`,
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-emerald-500" />
            Upgrade to {plan.name}
          </DialogTitle>
          <DialogDescription>
            Complete your upgrade to the {plan.name} plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Summary */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-semibold">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Billing</span>
              <span className="text-sm font-semibold">Monthly</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ${plan.price}/mo
              </span>
            </div>
          </div>

          {/* Card Form Placeholder */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Card Number</Label>
              <Input placeholder="4242 4242 4242 4242" disabled />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Expiry</Label>
                <Input placeholder="MM/YY" disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CVC</Label>
                <Input placeholder="123" disabled />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Payments are secured with 256-bit encryption</span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Razorpay
              </>
            )}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            Demo mode — no real charges will be made
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Billing Component ───────────────────────────────────────────────────

export default function Billing() {
  const { user } = useAppStore()
  const [selectedPlan, setSelectedPlan] = useState<(typeof demoPlans)[0] | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const currentPlanId = user?.plan || 'pro'

  const aiCreditsUsed = 1568
  const aiCreditsLimit = 2500
  const aiCreditsPercent = (aiCreditsUsed / aiCreditsLimit) * 100
  const teamMembers = 3
  const teamMembersLimit = 5
  const storageUsed = 4.2
  const storageLimit = 10

  const handleUpgrade = (plan: (typeof demoPlans)[0]) => {
    if (plan.id === 'enterprise') {
      toast.info('Contact Sales', {
        description: 'Our sales team will reach out to set up your Enterprise plan.',
      })
      return
    }
    setSelectedPlan(plan)
    setPaymentOpen(true)
  }

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Current Plan Card ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Crown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {user?.plan === 'pro' ? 'Pro' : user?.plan === 'starter' ? 'Starter' : user?.plan === 'enterprise' ? 'Enterprise' : 'Free'} Plan
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold uppercase">
                      Active
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Renews {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; ${currentPlanId === 'enterprise' ? '349' : currentPlanId === 'pro' ? '129' : currentPlanId === 'starter' ? '49' : '0'}/month
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => toast.info('Subscription Management', { description: 'Connect Razorpay to manage subscriptions' })}>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'Unlimited leads & CRM pipeline',
                'Unlimited website audits',
                'AI outreach with sequences',
                'Advanced proposals + e-sign',
                'Team collaboration (5 members)',
                'API access & white-label reports',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="sm:hidden">
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Subscription Management', { description: 'Connect Razorpay to manage subscriptions' })}>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* ─── Pricing Plans Grid ────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Pricing Plans</h2>
          <p className="text-sm text-muted-foreground">
            Choose the plan that fits your growth needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {demoPlans.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const isPopular = plan.popular

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
                  isPopular && 'border-emerald-500/50 shadow-md shadow-emerald-500/10',
                  isCurrent && 'border-border'
                )}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white border-0 shadow-sm text-[10px] font-bold uppercase tracking-wide px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Gradient border effect for popular */}
                {isPopular && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-emerald-500/20 via-transparent to-teal-500/10 pointer-events-none" />
                )}

                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  </div>
                  <CardDescription className="min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 relative z-10">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      {plan.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="relative z-10">
                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        'w-full',
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : ''
                      )}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => handleUpgrade(plan)}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* ─── Usage Section ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Usage This Period</h2>
          <p className="text-sm text-muted-foreground">
            Your resource usage for the current billing period
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* AI Credits */}
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Credits</p>
                  <p className="text-xs text-muted-foreground">
                    {aiCreditsUsed.toLocaleString()} / {aiCreditsLimit.toLocaleString()} used
                  </p>
                </div>
              </div>
              <Progress value={aiCreditsPercent} className="h-2.5" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{aiCreditsPercent.toFixed(0)}% used</span>
                <span>{(aiCreditsLimit - aiCreditsUsed).toLocaleString()} remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
                  <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Team Members</p>
                  <p className="text-xs text-muted-foreground">
                    {teamMembers} / {teamMembersLimit} seats
                  </p>
                </div>
              </div>
              <Progress value={(teamMembers / teamMembersLimit) * 100} className="h-2.5" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{((teamMembers / teamMembersLimit) * 100).toFixed(0)}% used</span>
                <span>{teamMembersLimit - teamMembers} seats available</span>
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <HardDrive className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Storage</p>
                  <p className="text-xs text-muted-foreground">
                    {storageUsed} GB / {storageLimit} GB
                  </p>
                </div>
              </div>
              <Progress value={(storageUsed / storageLimit) * 100} className="h-2.5" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{((storageUsed / storageLimit) * 100).toFixed(0)}% used</span>
                <span>{(storageLimit - storageUsed).toFixed(1)} GB available</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ─── Payment History ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Payment History</CardTitle>
            </div>
            <CardDescription>
              Your recent invoices and payment records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {invoice.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {invoice.id}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-wide border-0',
                            invoice.status === 'paid'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          )}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Invoice Downloaded', { description: `Invoice ${invoice.id} downloaded` })}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Payment Dialog ────────────────────────────────────────────────── */}
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        plan={selectedPlan}
      />
    </motion.div>
  )
}
