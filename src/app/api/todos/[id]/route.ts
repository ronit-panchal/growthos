import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext } from '@/lib/tenant'

// PATCH /api/todos/[id] - Update a todo (toggle completed)
export async function PATCH(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantContext()
    return NextResponse.json({ error: 'Todos module is not enabled in this build.' }, { status: 501 })
  } catch (error) {
    console.error('Error updating todo:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantContext()
    return NextResponse.json({ error: 'Todos module is not enabled in this build.' }, { status: 501 })
  } catch (error) {
    console.error('Error deleting todo:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
