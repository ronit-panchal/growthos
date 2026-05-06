import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/audits/[id] - Get audit by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const audit = await db.auditJob.findUnique({
      where: { id },
    });

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ audit });
  } catch (error) {
    console.error('Error fetching audit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    );
  }
}

// PUT /api/audits/[id] - Update audit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      progress,
      overallScore,
      seoScore,
      uxScore,
      performance,
      accessibility,
      findings,
      suggestions,
      error: auditError,
      completedAt,
    } = body;

    // Check if audit exists
    const existingAudit = await db.auditJob.findUnique({ where: { id } });
    if (!existingAudit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = parseInt(String(progress));
    if (overallScore !== undefined) updateData.overallScore = parseInt(String(overallScore));
    if (seoScore !== undefined) updateData.seoScore = parseInt(String(seoScore));
    if (uxScore !== undefined) updateData.uxScore = parseInt(String(uxScore));
    if (performance !== undefined) updateData.performance = parseInt(String(performance));
    if (accessibility !== undefined) updateData.accessibility = parseInt(String(accessibility));
    if (findings !== undefined) updateData.findings = JSON.stringify(findings);
    if (suggestions !== undefined) updateData.suggestions = JSON.stringify(suggestions);
    if (auditError !== undefined) updateData.error = auditError;
    if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null;

    const audit = await db.auditJob.update({
      where: { id },
      data: updateData,
    });

    // If audit just completed, create an activity
    if (status === 'completed' && existingAudit.status !== 'completed') {
      await db.activity.create({
        data: {
          type: 'audit_completed',
          title: 'Website audit completed',
          description: `Audit for ${existingAudit.url} finished with score ${overallScore || 0}/100`,
          userId: existingAudit.userId,
        },
      });
    }

    return NextResponse.json({ audit });
  } catch (error) {
    console.error('Error updating audit:', error);
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 500 }
    );
  }
}
