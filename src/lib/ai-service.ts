interface AuditAnalysis {
  overallScore: number
  seoScore: number
  uxScore: number
  performanceScore: number
  accessibilityScore: number
  findings: Array<{ category: string; issue: string; severity: 'high' | 'medium' | 'low' }>
  suggestions: Array<{ title: string; description: string; impact: string }>
}

interface ProposalContent {
  sections: Array<{ title: string; content: string }>
  pricing: Array<{ item: string; cost: number; quantity: number }>
  totalValue: number
}

interface OutreachContent {
  subjectLine: string
  content: string
  cta: string
  tone: string
}

type AIOutputOptions = {
  style?: 'formal' | 'advanced' | 'professional'
  length?: 'short' | 'medium' | 'long'
}

function outputDirective(options?: AIOutputOptions) {
  const style = options?.style || 'professional'
  const length = options?.length || 'medium'
  return `Style must be ${style}. Length must be ${length}.`
}

function tokenLimit(length?: AIOutputOptions['length']) {
  if (length === 'short') return 1200
  if (length === 'long') return 3200
  return 2200
}

export async function generateAuditWithAI(url: string, options?: AIOutputOptions): Promise<AuditAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'

  if (!apiKey) {
    return generateMockAudit()
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an expert web auditor. Analyze websites and provide detailed audits.
            Return JSON with this structure:
            {
              "overallScore": 0-100,
              "seoScore": 0-100,
              "uxScore": 0-100,
              "performanceScore": 0-100,
              "accessibilityScore": 0-100,
              "findings": [{"category": "...", "issue": "...", "severity": "high|medium|low"}],
              "suggestions": [{"title": "...", "description": "...", "impact": "..."}]
            }`,
          },
          {
            role: 'user',
            content: `Perform a comprehensive audit of ${url}. Provide actionable recommendations. ${outputDirective(options)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: tokenLimit(options?.length),
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText)
      return generateMockAudit()
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const content = data.choices?.[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) return generateMockAudit()

    return JSON.parse(jsonMatch[0]) as AuditAnalysis
  } catch (error) {
    console.error('Audit generation error:', error)
    return generateMockAudit()
  }
}

export async function generateProposalWithAI(
  clientName: string,
  projectScope: string,
  budget: number,
  options?: AIOutputOptions
): Promise<ProposalContent> {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'

  if (!apiKey) {
    return generateMockProposal(clientName, budget)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a professional proposal writer. Generate comprehensive proposals.
            Return JSON with this structure:
            {
              "sections": [{"title": "...", "content": "..."}],
              "pricing": [{"item": "...", "cost": number, "quantity": number}],
              "totalValue": number
            }`,
          },
          {
            role: 'user',
            content: `Create a professional proposal for ${clientName} for: ${projectScope}. Budget: $${budget}. ${outputDirective(options)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: tokenLimit(options?.length),
      }),
    })

    if (!response.ok) {
      return generateMockProposal(clientName, budget)
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const content = data.choices?.[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) return generateMockProposal(clientName, budget)

    return JSON.parse(jsonMatch[0]) as ProposalContent
  } catch (error) {
    console.error('Proposal generation error:', error)
    return generateMockProposal(clientName, budget)
  }
}

export async function generateOutreachWithAI(
  tone: string,
  industry: string,
  audience: string,
  options?: AIOutputOptions
): Promise<OutreachContent> {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'

  if (!apiKey) {
    return generateMockOutreach(tone)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter for cold outreach. Generate compelling emails.
            Return JSON with this structure:
            {
              "subjectLine": "...",
              "content": "...",
              "cta": "...",
              "tone": "${tone}"
            }`,
          },
          {
            role: 'user',
            content: `Write a cold outreach email for the ${industry} industry, targeting ${audience}, with a ${tone} tone. ${outputDirective(options)}`,
          },
        ],
        temperature: 0.8,
        max_tokens: tokenLimit(options?.length),
      }),
    })

    if (!response.ok) {
      return generateMockOutreach(tone)
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const content = data.choices?.[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) return generateMockOutreach(tone)

    return JSON.parse(jsonMatch[0]) as OutreachContent
  } catch (error) {
    console.error('Outreach generation error:', error)
    return generateMockOutreach(tone)
  }
}

function generateMockAudit(): AuditAnalysis {
  return {
    overallScore: 72,
    seoScore: 78,
    uxScore: 68,
    performanceScore: 72,
    accessibilityScore: 65,
    findings: [
      {
        category: 'SEO',
        issue: 'Missing meta descriptions',
        severity: 'high',
      },
      {
        category: 'Performance',
        issue: 'Images not optimized',
        severity: 'medium',
      },
      {
        category: 'Accessibility',
        issue: 'Missing alt text',
        severity: 'medium',
      },
    ],
    suggestions: [
      {
        title: 'Add meta descriptions',
        description: 'Each page should have a unique meta description under 160 characters.',
        impact: 'Improve click-through rate by 5-10%',
      },
      {
        title: 'Optimize images',
        description: 'Compress images and use modern formats like WebP.',
        impact: 'Improve page speed by 30%',
      },
      {
        title: 'Improve accessibility',
        description: 'Add alt text to all images and ensure proper heading structure.',
        impact: 'Improve accessibility score by 25%',
      },
    ],
  }
}

function generateMockProposal(clientName: string, budget: number): ProposalContent {
  return {
    sections: [
      {
        title: 'Executive Summary',
        content: `This proposal outlines the project scope and deliverables for ${clientName}. We are committed to delivering exceptional results within the agreed timeline and budget.`,
      },
      {
        title: 'Project Scope',
        content:
          'The project includes comprehensive analysis, strategy development, implementation, and ongoing support to achieve your business objectives.',
      },
      {
        title: 'Deliverables',
        content:
          'Weekly reports, monthly strategy reviews, dedicated account management, and 24/7 support for critical issues.',
      },
      {
        title: 'Timeline',
        content:
          'Project duration: 3-6 months with clear milestones and review checkpoints every 2 weeks.',
      },
    ],
    pricing: [
      { item: 'Strategy & Planning', cost: budget * 0.2, quantity: 1 },
      { item: 'Implementation', cost: budget * 0.5, quantity: 1 },
      { item: 'Support & Optimization', cost: budget * 0.3, quantity: 1 },
    ],
    totalValue: budget,
  }
}

function generateMockOutreach(tone: string): OutreachContent {
  const tones: Record<string, OutreachContent> = {
    professional: {
      subjectLine: 'Strategic Partnership Opportunity for Your Business',
      content: `Hi there,

I've been following your company's growth and I'm impressed with what you're building. I think there's a great opportunity to help you scale even faster.

We specialize in helping companies like yours achieve their goals through strategic partnerships and tailored solutions. Would you be open to a quick 15-minute call to explore how we can add value?

Best regards`,
      cta: 'Schedule a Call',
      tone: 'professional',
    },
    casual: {
      subjectLine: 'Quick idea for your team',
      content: `Hey!

I noticed you're doing some cool stuff in your space. We recently helped a similar company achieve their goals, and I think we could do the same for you.

Want to chat over coffee (virtual or IRL)? No pressure, just exploring if there's a good fit.

Cheers`,
      cta: "Let's Chat",
      tone: 'casual',
    },
    assertive: {
      subjectLine: 'Your competitors are getting ahead',
      content: `Hello,

Your competitors are already leveraging strategies that give them 3x better results. The question isn't whether you should act, but how quickly you can catch up.

We help market leaders like these companies stay ahead. Let's discuss how you can join them.

Looking forward to talking`,
      cta: 'Start Here',
      tone: 'assertive',
    },
  }

  return tones[tone.toLowerCase()] || tones.professional
}
