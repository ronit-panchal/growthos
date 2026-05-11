'use client'

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  User, 
  CreditCard, 
  HelpCircle,
  LogOut,
  Crown
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  plan: string
  role: string
}

export function UserProfileMenu({ user }: { user: UserProfile }) {
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSignOut = async () => {
    await fetch('/api/auth/session-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'logout', metadata: { source: 'profile-menu' } }),
    }).catch(() => null)
    await signOut({ callbackUrl: '/login' })
    router.refresh()
  }

  const initials = (user.name || user.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
        <DropdownMenuTrigger asChild>
          <button className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-white/10 px-3 py-1.5 pr-5 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 shadow-sm hover:shadow-md">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 ring-2 ring-white/20 group-hover:ring-emerald-400/50 transition-all duration-300 group-hover:scale-105">
                {initials}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
            
            {/* User info (hidden on mobile) */}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground leading-none">
                {user.name?.split(' ')[0] || user.email.split('@')[0]}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5 capitalize leading-none">
                {user.plan} Plan
              </span>
            </div>
            
            {/* Chevron */}
            <svg 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {user.plan}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/pricing" className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Change Plan
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/support" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
