import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProposalWithAI } from '@/lib/ai-service'
import { requireTenantContext } from '@/lib/tenant'

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()

    const body = (await request.json()) as {
      clientName?: string
      projectScope?: string
      budget?: number
      responseStyle?: 'formal' | 'advanced' | 'professional'
      responseLength?: 'short' | 'medium' | 'long'
    }
    const { clientName, projectScope, budget } = body

    if (!clientName || !projectScope || !budget) {
      return NextResponse.json(
        { error: 'clientName, projectScope, and budget are required' },
        { status: 400 }
      )
    }

    // Generate proposal with AI
    const proposalContent = await generateProposalWithAI(clientName, projectScope, budget, {
      style: body.responseStyle,
      length: body.responseLength,
    })

    // Create proposal in database
    const proposal = await db.proposal.create({
      data: {
        userId: tenant.userId,
        title: `${clientName} - ${projectScope}`,
        clientName,
        status: 'draft',
        sections: JSON.stringify(proposalContent.sections),
        pricing: JSON.stringify(proposalContent.pricing),
        totalValue: proposalContent.totalValue,
      },
    })

    // Log activity
    await db.activity.create({
      data: {
        type: 'proposal_created',
        title: 'Proposal generated with AI',
        description: `AI-generated proposal for ${clientName}: $${proposalContent.totalValue}`,
        userId: tenant.userId,
      },
    })

    return NextResponse.json({
      ok: true,
      proposal,
      content: proposalContent,
    })
  } catch (error) {
    console.error('Error generating proposal:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate proposal' },
      { status: 500 }
    )
  }
}
