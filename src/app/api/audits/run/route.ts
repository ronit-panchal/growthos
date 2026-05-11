import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateAuditWithAI } from '@/lib/ai-service'
import { requireTenantContext } from '@/lib/tenant'

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

function normalizeAuditPayload(input: Awaited<ReturnType<typeof generateAuditWithAI>>): Partial<AuditResult> {
  return {
    overallScore: input.overallScore,
    seoScore: input.seoScore,
    uxScore: input.uxScore,
    performance:
      'performance' in input && typeof input.performance === 'number'
        ? input.performance
        : 'performanceScore' in input && typeof input.performanceScore === 'number'
          ? input.performanceScore
          : 0,
    accessibility:
      'accessibility' in input && typeof input.accessibility === 'number'
        ? input.accessibility
        : 'accessibilityScore' in input && typeof input.accessibilityScore === 'number'
          ? input.accessibilityScore
          : 0,
    findings: Array.isArray(input.findings)
      ? input.findings.map((finding) => ({
          category: finding.category as AuditFinding['category'],
          severity: finding.severity as AuditFinding['severity'],
          title:
            'title' in finding && typeof finding.title === 'string'
              ? finding.title
              : 'issue' in finding && typeof finding.issue === 'string'
                ? finding.issue
                : 'Audit finding',
          description:
            'description' in finding && typeof finding.description === 'string'
              ? finding.description
              : 'issue' in finding && typeof finding.issue === 'string'
                ? finding.issue
                : 'Needs review.',
        }))
      : [],
    suggestions: Array.isArray(input.suggestions)
      ? input.suggestions.map((suggestion) =>
          typeof suggestion === 'string'
            ? suggestion
            : [suggestion.title, suggestion.description].filter(Boolean).join(': ')
        )
      : [],
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await requireTenantContext()
    const { auditId, url, responseStyle, responseLength } = (await request.json()) as {
      auditId?: string
      url?: string
      responseStyle?: 'formal' | 'advanced' | 'professional'
      responseLength?: 'short' | 'medium' | 'long'
    }

    if (!auditId || !url) {
      return NextResponse.json({ error: 'auditId and url are required' }, { status: 400 })
    }

    const audit = await db.auditJob.findFirst({ where: { id: auditId, userId: tenant.userId } })
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    await db.auditJob.update({
      where: { id: auditId },
      data: { status: 'running', progress: 20 },
    })

    const generatedAudit = await generateAuditWithAI(url, { style: responseStyle, length: responseLength })
    const auditResults = sanitizeResult(normalizeAuditPayload(generatedAudit))

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

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to run audit. Ensure AI provider is configured.' },
      { status: 500 }
    )
  }
}
