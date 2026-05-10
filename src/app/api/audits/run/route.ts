import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type AuditFinding = {
  category: 'SEO' | 'Performance' | 'UX' | 'Accessibility'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
}

type AuditResult = {
  overallScore: number
  seoScore: number
  uxScore: number
  performance: number
  accessibility: number
  findings: AuditFinding[]
  suggestions: string[]
}

function sanitizeResult(input: Partial<AuditResult>): AuditResult {
  return {
    overallScore: Math.min(100, Math.max(0, Math.round(input.overallScore || 0))),
    seoScore: Math.min(100, Math.max(0, Math.round(input.seoScore || 0))),
    uxScore: Math.min(100, Math.max(0, Math.round(input.uxScore || 0))),
    performance: Math.min(100, Math.max(0, Math.round(input.performance || 0))),
    accessibility: Math.min(100, Math.max(0, Math.round(input.accessibility || 0))),
    findings: Array.isArray(input.findings) ? input.findings : [],
    suggestions: Array.isArray(input.suggestions) ? input.suggestions : [],
  }
}

export async function POST(request: NextRequest) {
  try {
    const { auditId, url } = (await request.json()) as { auditId?: string; url?: string }

    if (!auditId || !url) {
      return NextResponse.json({ error: 'auditId and url are required' }, { status: 400 })
    }

    const audit = await db.auditJob.findUnique({ where: { id: auditId } })
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    await db.auditJob.update({
      where: { id: auditId },
      data: { status: 'running', progress: 20 },
    })

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const sdk = await ZAI.create()

    const prompt = `You are a website audit expert. Analyze website "${url}".
Return ONLY valid JSON:
{
  "overallScore": <0-100>,
  "seoScore": <0-100>,
  "uxScore": <0-100>,
  "performance": <0-100>,
  "accessibility": <0-100>,
  "findings": [
    {"category":"SEO|Performance|UX|Accessibility","severity":"high|medium|low","title":"...","description":"..."}
  ],
  "suggestions": ["...", "..."]
}`

    const result = await sdk.chat.completions.create({
      messages: [
        { role: 'system', content: 'Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      model: 'default',
    })

    let responseText = ''
    if (result?.choices?.[0]?.message?.content) {
      responseText = result.choices[0].message.content
    } else if (typeof result === 'string') {
      responseText = result
    } else if ((result as { content?: string })?.content) {
      responseText = (result as { content?: string }).content || ''
    }

    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(responseText) as Partial<AuditResult>
    const auditResults = sanitizeResult(parsed)

    const updatedAudit = await db.auditJob.update({
      where: { id: auditId },
      data: {
        status: 'completed',
        progress: 100,
        overallScore: auditResults.overallScore,
        seoScore: auditResults.seoScore,
        uxScore: auditResults.uxScore,
        performance: auditResults.performance,
        accessibility: auditResults.accessibility,
        findings: JSON.stringify(auditResults.findings),
        suggestions: JSON.stringify(auditResults.suggestions),
        completedAt: new Date(),
      },
    })

    await db.activity.create({
      data: {
        type: 'audit_completed',
        title: 'Website audit completed',
        description: `Audit for ${url} finished with score ${auditResults.overallScore}/100`,
        userId: audit.userId,
      },
    })

    return NextResponse.json({ audit: updatedAudit, results: auditResults })
  } catch (error) {
    const body = await request.clone().json().catch(() => ({} as { auditId?: string }))
    if (body.auditId) {
      await db.auditJob
        .update({
          where: { id: body.auditId },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        })
        .catch(() => null)
    }

    return NextResponse.json(
      { error: 'Failed to run audit. Ensure AI provider is configured.' },
      { status: 500 }
    )
  }
}
