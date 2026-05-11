import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext } from '@/lib/tenant'

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantContext()
    return NextResponse.json({ error: 'Notes module is not enabled in this build.' }, { status: 501 })
  } catch (error) {
    console.error('Error deleting note:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
