import { NextRequest, NextResponse } from 'next/server'
import { generateOutreachWithAI } from '@/lib/ai-service'
import { requireTenantContext } from '@/lib/tenant'

export async function POST(request: NextRequest) {
  try {
    await requireTenantContext()
    const body = (await request.json()) as {
      tone?: string
      industry?: string
      targetAudience?: string
      responseStyle?: 'formal' | 'advanced' | 'professional'
      responseLength?: 'short' | 'medium' | 'long'
    }

    const tone = body.tone || 'professional'
    const industry = body.industry || 'general'
    const audience = body.targetAudience || 'business decision makers'

    // Generate outreach content with AI
    const generated = await generateOutreachWithAI(tone, industry, audience, {
      style: body.responseStyle,
      length: body.responseLength,
    })

    return NextResponse.json({
      ok: true,
      content: generated,
      message: 'Outreach content generated successfully',
    })
  } catch (error) {
    console.error('Error generating outreach:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      {
        error: 'Failed to generate outreach content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
