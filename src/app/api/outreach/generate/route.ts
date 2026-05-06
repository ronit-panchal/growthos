import { NextRequest, NextResponse } from 'next/server';

// Mock outreach content generator
function generateMockOutreachContent(
  type: string,
  tone: string,
  industry: string,
  targetAudience: string,
  personalization: string
) {
  const templates: Record<string, Record<string, { subject: string; content: string; cta: string; sequence: Array<{ step: number; type: string; delay: string; subject: string }> }>> = {
    cold_email: {
      professional: {
        subject: `Unlock growth for {{company}} — proven results in ${industry || 'your industry'}`,
        content: `Hi {{firstName}},\n\nI noticed {{company}} is making waves in the ${industry || 'industry'} space — impressive trajectory.\n\nI'm reaching out because we've helped companies similar to {{company}} achieve measurable growth through data-driven strategies. Our clients typically see:\n\n• 35-50% increase in qualified leads\n• 25% improvement in conversion rates\n• 40% reduction in customer acquisition cost\n\nI'd love to share how we could replicate these results for {{company}}.${personalization ? `\n\n${personalization}` : ''}\n\nWould you be open to a brief conversation this week?\n\nBest regards,\n{{senderName}}`,
        cta: 'Schedule a 15-minute discovery call',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: `Unlock growth for {{company}} — proven results in ${industry || 'your industry'}` },
          { step: 2, type: 'email', delay: '3 days', subject: 'Re: Following up on growth opportunities for {{company}}' },
          { step: 3, type: 'linkedin', delay: '7 days', subject: 'Connection request + personalized note' },
          { step: 4, type: 'email', delay: '10 days', subject: 'Quick question about {{company}} growth goals' },
        ],
      },
      casual: {
        subject: `Hey {{firstName}} — quick thought on ${industry || 'your'} growth`,
        content: `Hey {{firstName}},\n\nJust came across {{company}} and had to reach out. Really cool stuff you're building!\n\nI work with ${industry || 'similar'} companies on growth, and I noticed a few areas where I think we could make a real impact pretty quickly.\n\nWithout giving you a full pitch — we typically help companies like yours:\n- Generate 2x more qualified leads\n- Close deals faster with better positioning\n- Scale without burning out the team\n\n${personalization ? `${personalization}\n\n` : ''}Worth a chat? I promise to keep it short and valuable.\n\nCheers,\n{{senderName}}`,
        cta: 'Let\'s grab 15 minutes',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: `Hey {{firstName}} — quick thought on ${industry || 'your'} growth` },
          { step: 2, type: 'email', delay: '2 days', subject: 'Re: Just bumping this up ^' },
          { step: 3, type: 'email', delay: '5 days', subject: '{{company}} growth — one more thing' },
        ],
      },
      friendly: {
        subject: `Love what {{company}} is building! Let's talk growth`,
        content: `Hi {{firstName}}!\n\nI hope this message finds you well. I've been following {{company}} for a while and I'm genuinely impressed by what you're building in the ${industry || 'industry'} space.\n\nI wanted to reach out because I believe there's a great opportunity for us to help accelerate {{company}}'s growth. We've worked with similar companies and consistently delivered:\n\n✅ 3x more inbound leads within 90 days\n✅ 45% faster sales cycles\n✅ Measurable ROI from month one\n\n${personalization ? `${personalization}\n\n` : ''}I'd love to learn more about your goals and see if there's a fit. No pressure — just a friendly conversation.\n\nWarmly,\n{{senderName}}`,
        cta: 'Start a friendly conversation',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: `Love what {{company}} is building! Let's talk growth` },
          { step: 2, type: 'email', delay: '4 days', subject: 'Re: Still thinking about {{company}}\'s potential' },
          { step: 3, type: 'linkedin', delay: '8 days', subject: 'Connection + personalized message' },
        ],
      },
      assertive: {
        subject: `${industry || 'Your'} competitors are outperforming you — here's why`,
        content: `{{firstName}},\n\nLet me be direct: your ${industry || 'industry'} competitors are investing heavily in growth strategies that {{company}} hasn't adopted yet.\n\nHere's what they're doing differently:\n1. Automated lead scoring and nurturing\n2. Data-driven conversion optimization\n3. Scalable outreach sequences\n\nThe companies we work with in ${industry || 'your space'} see an average 40% revenue increase within 6 months of implementing these strategies.\n\n${personalization ? `${personalization}\n\n` : ''}The question isn't whether you should act — it's whether you can afford not to.\n\nLet's talk about how to close this gap, fast.\n\nRegards,\n{{senderName}}`,
        cta: 'Book a strategy session now',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: `${industry || 'Your'} competitors are outperforming you — here's why` },
          { step: 2, type: 'email', delay: '2 days', subject: 'Re: The cost of waiting for {{company}}' },
          { step: 3, type: 'linkedin', delay: '5 days', subject: 'Connection + industry insight message' },
          { step: 4, type: 'email', delay: '8 days', subject: 'Last chance: {{company}} growth gap analysis' },
        ],
      },
    },
    follow_up: {
      professional: {
        subject: 'Re: Following up — your {{company}} audit results',
        content: `Hi {{firstName}},\n\nI wanted to follow up on the audit results we shared for {{company}}. I understand you're busy, but I didn't want these insights to get lost in your inbox.\n\nKey highlights from the audit:\n• Your site could load 40% faster\n• We identified 3 major conversion blockers\n• SEO opportunities worth an estimated 2,000+ monthly visitors\n\n${personalization ? `${personalization}\n\n` : ''}Would you like me to walk you through the results? I can keep it to 15 minutes.\n\nBest,\n{{senderName}}`,
        cta: 'Schedule a quick review call',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Re: Following up — your {{company}} audit results' },
          { step: 2, type: 'email', delay: '3 days', subject: 'Quick recap of {{company}} audit findings' },
          { step: 3, type: 'email', delay: '7 days', subject: 'Still interested in those audit results?' },
        ],
      },
      casual: {
        subject: 'Re: Your audit results are still waiting! 📊',
        content: `Hey {{firstName}},\n\nJust a quick bump on those audit results for {{company}}. Some really valuable stuff in there that I'd hate for you to miss.\n\nWant me to send over a quick summary? Or we can hop on a 10-minute call?\n\n${personalization ? `${personalization}\n\n` : ''}No pressure either way!\n\n{{senderName}}`,
        cta: 'Send me the summary',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Re: Your audit results are still waiting! 📊' },
          { step: 2, type: 'email', delay: '3 days', subject: 'Re: Quick summary of {{company}} results' },
          { step: 3, type: 'email', delay: '7 days', subject: 'One last check on {{company}} audit' },
        ],
      },
      friendly: {
        subject: 'Checking in on {{company}} audit results',
        content: `Hi {{firstName}}!\n\nJust circling back on the audit we ran for {{company}}. I know how busy things get, so I wanted to make sure these results didn't slip through the cracks.\n\nThe good news: there are some quick wins that could make a real difference for {{company}}.\n\n${personalization ? `${personalization}\n\n` : ''}Whenever you have a moment, I'd love to walk you through the findings. Totally flexible on timing!\n\nBest,\n{{senderName}}`,
        cta: 'Pick a time that works',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Checking in on {{company}} audit results' },
          { step: 2, type: 'email', delay: '4 days', subject: 'Re: Quick wins for {{company}}' },
          { step: 3, type: 'linkedin', delay: '9 days', subject: 'Friendly connection + audit recap' },
        ],
      },
      assertive: {
        subject: 'Your competitors are using these audit insights — are you?',
        content: `{{firstName}},\n\nI sent you audit results for {{company}} last week. Every day you don't act on these findings, your competitors gain an edge.\n\nHere's what you're missing:\n• 40% faster site performance\n• 3x better conversion potential\n• 2,000+ organic traffic opportunity\n\n${personalization ? `${personalization}\n\n` : ''}Let's discuss how to implement these changes before your competition does.\n\n{{senderName}}`,
        cta: 'Book implementation call',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Your competitors are using these audit insights — are you?' },
          { step: 2, type: 'email', delay: '2 days', subject: 'Re: The window is closing for {{company}}' },
          { step: 3, type: 'email', delay: '5 days', subject: 'Final follow-up: {{company}} competitive gap' },
        ],
      },
    },
    linkedin: {
      professional: {
        subject: 'Connection request — growth strategies for {{company}}',
        content: `Hi {{firstName}},\n\nI came across your profile and noticed your work at {{company}}. I help ${industry || 'similar'} companies implement data-driven growth strategies.\n\nI'd love to connect and share some insights that might be valuable for your team.\n\nBest,\n{{senderName}}`,
        cta: 'Connect on LinkedIn',
        sequence: [
          { step: 1, type: 'linkedin', delay: '0 days', subject: 'Connection request — growth strategies for {{company}}' },
          { step: 2, type: 'linkedin', delay: '5 days', subject: 'Follow-up message with industry insights' },
          { step: 3, type: 'email', delay: '10 days', subject: 'Continuing our conversation about {{company}} growth' },
        ],
      },
      casual: {
        subject: 'Hey {{firstName}} — fellow {{industry}} enthusiast',
        content: `Hey {{firstName}}!\n\nSaw your work at {{company}} and had to connect. Love what you're doing in ${industry || 'the space'}.\n\nWould be great to swap notes sometime!\n\n{{senderName}}`,
        cta: 'Connect on LinkedIn',
        sequence: [
          { step: 1, type: 'linkedin', delay: '0 days', subject: 'Hey {{firstName}} — fellow {{industry}} enthusiast' },
          { step: 2, type: 'linkedin', delay: '5 days', subject: 'Quick thought on {{company}}' },
        ],
      },
      friendly: {
        subject: 'Would love to connect — {{company}} is doing great work!',
        content: `Hi {{firstName}}!\n\nI've been following {{company}}'s journey and I'm really impressed. I work with ${industry || 'similar'} companies on growth and I think there could be some great synergy.\n\nWould love to connect and maybe share some ideas!\n\nWarmly,\n{{senderName}}`,
        cta: 'Connect on LinkedIn',
        sequence: [
          { step: 1, type: 'linkedin', delay: '0 days', subject: 'Would love to connect — {{company}} is doing great work!' },
          { step: 2, type: 'linkedin', delay: '7 days', subject: 'Following up — growth ideas for {{company}}' },
        ],
      },
      assertive: {
        subject: '{{company}} vs. the competition — let\'s talk strategy',
        content: `{{firstName}},\n\nI've been analyzing ${industry || 'your industry'} and I see a clear opportunity for {{company}} to capture market share.\n\nI help companies like yours implement aggressive growth strategies. Let's connect and I'll share what I've found.\n\n{{senderName}}`,
        cta: 'Connect and discuss strategy',
        sequence: [
          { step: 1, type: 'linkedin', delay: '0 days', subject: '{{company}} vs. the competition — let\'s talk strategy' },
          { step: 2, type: 'linkedin', delay: '3 days', subject: 'Competitive analysis for {{company}}' },
          { step: 3, type: 'email', delay: '7 days', subject: 'Expanding on our LinkedIn conversation' },
        ],
      },
    },
    custom: {
      professional: {
        subject: `Custom outreach for ${industry || 'your company'} — let's connect`,
        content: `Hi {{firstName}},\n\nI wanted to reach out personally regarding {{company}}. After researching your ${industry || 'industry'} landscape, I believe there are significant opportunities we can explore together.\n\n${personalization || 'I\'d welcome the chance to discuss how we might collaborate.'}\n\nLooking forward to connecting.\n\nBest regards,\n{{senderName}}`,
        cta: 'Let\'s connect',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: `Custom outreach for ${industry || 'your company'} — let's connect` },
          { step: 2, type: 'email', delay: '3 days', subject: 'Re: Following up' },
          { step: 3, type: 'linkedin', delay: '7 days', subject: 'Connection request' },
        ],
      },
      casual: {
        subject: `Quick thought for {{firstName}} at {{company}}`,
        content: `Hey {{firstName}},\n\nHad a thought about {{company}} and wanted to share. ${personalization || 'There might be some cool ways we could work together.'}\n\nLet me know if you're open to chatting!\n\n{{senderName}}`,
        cta: 'Open to chatting?',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Quick thought for {{firstName}} at {{company}}' },
          { step: 2, type: 'email', delay: '3 days', subject: 'Re: Still thinking about {{company}}' },
        ],
      },
      friendly: {
        subject: `Would love to connect with you, {{firstName}}!`,
        content: `Hi {{firstName}}!\n\nI've been thinking about {{company}} and how we might be able to create something great together.\n\n${personalization || 'I have some ideas I\'d love to share — no strings attached.'}\n\nWould love to chat whenever works for you!\n\nWarmly,\n{{senderName}}`,
        cta: 'Chat sometime?',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Would love to connect with you, {{firstName}}!' },
          { step: 2, type: 'linkedin', delay: '5 days', subject: 'Connection request' },
        ],
      },
      assertive: {
        subject: `Don't miss this opportunity for {{company}}`,
        content: `{{firstName}},\n\nI don't reach out to every company in ${industry || 'your space'} — but {{company}} stands out. And I think you're leaving money on the table.\n\n${personalization || 'Let me show you exactly what I mean.'}\n\n{{senderName}}`,
        cta: 'See the opportunity',
        sequence: [
          { step: 1, type: 'email', delay: '0 days', subject: 'Don\'t miss this opportunity for {{company}}' },
          { step: 2, type: 'email', delay: '2 days', subject: 'Re: Time-sensitive for {{company}}' },
          { step: 3, type: 'linkedin', delay: '5 days', subject: 'Connection + details' },
        ],
      },
    },
  };

  // Get the template for the requested type and tone
  const typeTemplates = templates[type] || templates.cold_email;
  const toneTemplate = typeTemplates[tone] || typeTemplates.professional;

  return toneTemplate;
}

// POST /api/outreach/generate - Generate outreach content with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, tone, industry, targetAudience, personalization } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'type is required' },
        { status: 400 }
      );
    }

    const outreachType = type || 'cold_email';
    const outreachTone = tone || 'professional';
    const outreachIndustry = industry || '';
    const outreachAudience = targetAudience || '';
    const outreachPersonalization = personalization || '';

    let generatedContent;

    try {
      // Try using the z-ai-web-dev-sdk for AI-powered content generation
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const sdk = await ZAI.create();

      const prompt = `You are an expert outreach copywriter. Generate a ${outreachType} campaign with a ${outreachTone} tone for the ${outreachIndustry || 'general'} industry${outreachAudience ? `, targeting ${outreachAudience}` : ''}.${outreachPersonalization ? ` Additional personalization context: ${outreachPersonalization}` : ''}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "subject": "<email subject line with {{firstName}} and {{company}} merge tags>",
  "content": "<email body with {{firstName}}, {{company}}, {{senderName}} merge tags>",
  "cta": "<call to action text>",
  "sequence": [
    {"step": 1, "type": "email|linkedin", "delay": "0 days", "subject": "<subject for this step>"},
    {"step": 2, "type": "email|linkedin", "delay": "3 days", "subject": "<subject for this step>"}
  ]
}

Create compelling, ${outreachTone} outreach content with 2-4 sequence steps. Use merge tags like {{firstName}}, {{company}}, and {{senderName}}.`;

      const result = await sdk.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert outreach copywriter. Always respond with valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt },
        ],
        model: 'default',
      });

      let responseText = '';
      if (result?.choices?.[0]?.message?.content) {
        responseText = result.choices[0].message.content;
      } else if (typeof result === 'string') {
        responseText = result;
      } else if (result?.content) {
        responseText = result.content;
      }

      // Clean up response
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const parsed = JSON.parse(responseText);

      generatedContent = {
        subject: parsed.subject || '',
        content: parsed.content || '',
        cta: parsed.cta || '',
        sequence: Array.isArray(parsed.sequence) ? parsed.sequence : [],
      };
    } catch (sdkError) {
      console.warn('AI SDK unavailable, using mock outreach content:', sdkError);

      // Fallback to mock content
      generatedContent = generateMockOutreachContent(
        outreachType,
        outreachTone,
        outreachIndustry,
        outreachAudience,
        outreachPersonalization
      );
    }

    return NextResponse.json({
      generated: generatedContent,
      meta: {
        type: outreachType,
        tone: outreachTone,
        industry: outreachIndustry,
        targetAudience: outreachAudience,
      },
    });
  } catch (error) {
    console.error('Error generating outreach content:', error);
    return NextResponse.json(
      { error: 'Failed to generate outreach content' },
      { status: 500 }
    );
  }
}
