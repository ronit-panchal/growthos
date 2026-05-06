import { create } from 'zustand'

export type AppPage = 
  | 'dashboard' 
  | 'leads' 
  | 'audit' 
  | 'outreach' 
  | 'proposals' 
  | 'billing' 
  | 'admin' 
  | 'settings'

interface AppState {
  currentPage: AppPage
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  isDemoMode: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
    company: string
    avatar: string | null
    plan: string
  } | null
  notifications: Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
    createdAt: string
  }>
  setCurrentPage: (page: AppPage) => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setUser: (user: AppState['user']) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'read' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'proposals',
  sidebarOpen: true,
  sidebarCollapsed: false,
  isDemoMode: true,
  user: {
    id: 'demo-user-1',
    name: 'Alex Morgan',
    email: 'alex@growthagency.io',
    role: 'agency_owner',
    company: 'Growth Agency',
    avatar: null,
    plan: 'pro',
  },
  notifications: [
    {
      id: 'n1',
      title: 'New Lead Captured',
      message: 'Sarah Chen from TechCorp submitted a website audit request',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'n2',
      title: 'Audit Complete',
      message: 'Website audit for acmecorp.com has been completed',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'n3',
      title: 'Proposal Accepted',
      message: 'Digital strategy proposal for StartupXYZ was accepted',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'n4',
      title: 'Subscription Renewal',
      message: 'Your Pro plan subscription renews in 5 days',
      type: 'warning',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
  setCurrentPage: (page) => set({ currentPage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setUser: (user) => set({ user }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `n-${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}))
