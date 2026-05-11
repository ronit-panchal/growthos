import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext } from '@/lib/tenant'

// POST /api/todos/[id]/remind - Mark reminder as shown
export async function POST(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantContext()
    return NextResponse.json({ error: 'Todos module is not enabled in this build.' }, { status: 501 })
  } catch (error) {
    console.error('Error marking reminder:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to mark reminder' }, { status: 500 })
  }
}
