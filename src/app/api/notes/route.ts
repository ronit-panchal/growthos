import { NextRequest, NextResponse } from 'next/server'

// GET /api/notes - Disabled for now
export async function GET(request: NextRequest) {
  return NextResponse.json({ notes: [] }, { status: 200 })
}

// POST /api/notes - Disabled for now  
export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Notes feature temporarily disabled' 
  }, { status: 503 })
}
