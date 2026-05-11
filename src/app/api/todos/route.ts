import { NextRequest, NextResponse } from 'next/server'

// GET /api/todos - Disabled for now
export async function GET(request: NextRequest) {
  return NextResponse.json({ todos: [] }, { status: 200 })
}

// POST /api/todos - Disabled for now  
export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Todos feature temporarily disabled' 
  }, { status: 503 })
}
