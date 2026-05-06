'use client'

import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Search,
  Send,
  FileText,
  CreditCard,
  Shield,
  Settings,
  Rocket,
  ChevronUp,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, type AppPage } from '@/lib/store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TopBar } from '@/components/layout/top-bar'
import dynamic from 'next/dynamic'

// Lazy load module components
const Dashboard = dynamic(() => import('@/components/modules/dashboard'), { ssr: false })
const LeadsModule = dynamic(() => import('@/components/modules/leads'), { ssr: false })
const AuditModule = dynamic(() => import('@/components/modules/audit'), { ssr: false })
const OutreachModule = dynamic(() => import('@/components/modules/outreach'), { ssr: false })
const ProposalsModule = dynamic(() => import('@/components/modules/proposals'), { ssr: false })
const BillingModule = dynamic(() => import('@/components/modules/billing'), { ssr: false })
const AdminModule = dynamic(() => import('@/components/modules/admin'), { ssr: false })
const SettingsModule = dynamic(() => import('@/components/modules/settings'), { ssr: false })

interface NavItem {
  title: string
  page: AppPage
  icon: ReactNode
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { title: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard /> },
  { title: 'Leads', page: 'leads', icon: <Users /> },
  { title: 'AI Audit', page: 'audit', icon: <Search /> },
  { title: 'Outreach', page: 'outreach', icon: <Send /> },
  { title: 'Proposals', page: 'proposals', icon: <FileText /> },
  { title: 'Billing', page: 'billing', icon: <CreditCard /> },
  { title: 'Admin', page: 'admin', icon: <Shield />, adminOnly: true },
  { title: 'Settings', page: 'settings', icon: <Settings /> },
]

const planBadgeColor: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  starter: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  pro: 'bg-primary/15 text-primary',
  enterprise: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

const planLabel: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function SidebarNav() {
  const { currentPage, setCurrentPage, user } = useAppStore()

  const filteredNavItems = navItems.filter(
    (item) =>
      !item.adminOnly ||
      user?.role === 'admin' ||
      user?.role === 'agency_owner'
  )

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-sidebar-accent/50"
              onClick={() => setCurrentPage('dashboard')}
            >
              <div className="flex size-8 items-center justify-center rounded-lg gradient-emerald">
                <Rocket className="size-4 text-white" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-base tracking-tight">
                  GrowthOS
                </span>
                <span className="text-[10px] text-sidebar-foreground/50">
                  AI Growth Platform
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const isActive = currentPage === item.page
                return (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => setCurrentPage(item.page)}
                      className={cn(
                        'transition-all duration-200',
                        isActive &&
                          'bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary'
                      )}
                    >
                      <span className={cn(
                        'transition-colors',
                        isActive ? 'text-primary' : 'text-sidebar-foreground/60'
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent/50"
                >
                  <Avatar className="size-8 border border-sidebar-border/50">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-sidebar-foreground/50 capitalize">
                        {user?.role?.replace('_', ' ')}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'h-4 px-1 text-[9px] font-bold uppercase tracking-wide border-0',
                          planBadgeColor[user?.plan || 'free']
                        )}
                      >
                        {planLabel[user?.plan || 'free']}
                      </Badge>
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-sidebar-foreground/40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-64"
              >
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="size-10 border border-border/50">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                    <div className="mt-0.5 flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'h-4 px-1 text-[9px] font-bold uppercase tracking-wide border-0',
                          planBadgeColor[user?.plan || 'free']
                        )}
                      >
                        <Crown className="mr-0.5 size-2.5" />
                        {planLabel[user?.plan || 'free']}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setCurrentPage('settings')}>
                  <Settings className="mr-2 size-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setCurrentPage('billing')}>
                  <CreditCard className="mr-2 size-4" />
                  Manage Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

const moduleMap: Record<AppPage, ReactNode> = {
  dashboard: <Dashboard />,
  leads: <LeadsModule />,
  audit: <AuditModule />,
  outreach: <OutreachModule />,
  proposals: <ProposalsModule />,
  billing: <BillingModule />,
  admin: <AdminModule />,
  settings: <SettingsModule />,
}

export function AppShell({ children }: { children?: ReactNode }) {
  const { currentPage } = useAppStore()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
        <SidebarNav />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <TopBar />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {children || moduleMap[currentPage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
