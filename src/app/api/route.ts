import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'GrowthOS API',
    version: '0.2.0',
    timestamp: new Date().toISOString()
  });
}