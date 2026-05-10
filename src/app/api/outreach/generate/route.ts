import { NextRequest, NextResponse } from 'next/server'

type OutreachResponse = {
  subject: string
  content: string
  cta: string
  sequence: Array<{ step: number; type: string; delay: string; subject: string }>
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string
      tone?: string
      industry?: string
      targetAudience?: string
      personalization?: string
    }

    if (!body.type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const sdk = await ZAI.create()

    const prompt = `Generate ${body.type} outreach copy in a ${body.tone || 'professional'} tone for ${body.industry || 'general'} industry.
Target audience: ${body.targetAudience || 'business decision makers'}.
Personalization context: ${body.personalization || 'none'}.

Return ONLY valid JSON:
{
  "subject":"...",
  "content":"...",
  "cta":"...",
  "sequence":[{"step":1,"type":"email|linkedin","delay":"0 days","subject":"..."}]
}`

    const result = await sdk.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert outreach copywriter. Return JSON only.' },
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
    const parsed = JSON.parse(responseText) as Partial<OutreachResponse>

    const generated: OutreachResponse = {
      subject: parsed.subject || '',
      content: parsed.content || '',
      cta: parsed.cta || '',
      sequence: Array.isArray(parsed.sequence) ? parsed.sequence : [],
    }

    return NextResponse.json({ generated })
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate outreach content. Ensure AI provider is configured.' },
      { status: 500 }
    )
  }
}
