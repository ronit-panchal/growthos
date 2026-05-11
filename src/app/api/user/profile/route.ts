import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireTenantContext } from '@/lib/tenant'

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    
    const user = await db.user.findUnique({
      where: { id: tenant.userId },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        plan: true,
        role: true,
        createdAt: true,
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const body = await request.json()
    const { name, email, company } = body
    
    // Check if email is being changed and if it's already in use
    if (email) {
      const existing = await db.user.findFirst({
        where: {
          email,
          NOT: { id: tenant.userId },
        },
      })
      
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
    }
    
    const updated = await db.user.update({
      where: { id: tenant.userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        company: company || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        plan: true,
        role: true,
        createdAt: true,
      },
    })
    
    // Log activity
    await db.activity.create({
      data: {
        type: 'profile_updated',
        title: 'Profile updated',
        description: 'User profile information was updated',
        userId: tenant.userId,
      },
    })
    
    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
