# Task: AI Outreach Generator Module

## Summary
Created the complete AI Outreach Generator module for GrowthOS at `/home/z/my-project/src/components/modules/outreach.tsx`.

## What Was Built

### 1. Header Section
- Title "AI Outreach Generator" with emerald-themed icon
- Subtitle description
- "New Campaign" button that opens the campaign generator dialog

### 2. Campaign Generator (Dialog)
- Campaign Name input
- Campaign Type selector using shadcn Select (Cold Email, Follow-up, LinkedIn, Custom)
- Tone selector with custom pill/toggle buttons (Professional, Casual, Friendly, Assertive) with emoji indicators
- Industry input field
- Target Audience textarea
- Personalization variables hint section showing `{{firstName}}`, `{{company}}`, `{{role}}`
- "Generate with AI" button with Sparkles icon and Loader2 loading state
- Simulated 2-second AI generation delay that populates:
  - Subject Line (editable Input with Copy button)
  - Email Body (editable Textarea with Copy button)
  - CTA Suggestion (editable Input with Copy button)
- "Save as Draft" and "Activate Campaign" buttons

### 3. Sequence Builder
- Visual timeline with step cards showing type icon, delay, subject
- Timeline connector lines between steps
- "Add Step" button to add more steps
- Hover-to-reveal Edit and Delete buttons on each step
- Edit step dialog with type selector, delay input, subject input

### 4. Saved Campaigns List
- Grid layout of campaigns from demoOutreach data
- Each card shows: name, target audience, type badge, tone badge, status badge, relative time
- Click to open detail sheet
- Duplicate and Delete action buttons with tooltips

### 5. Campaign Detail View (Sheet)
- Full campaign content display
- Badges for type, tone, status, industry
- Campaign stats section (sent, opened, replied with rates) - mock numbers based on status
- Subject line with copy button
- Email body with copy button
- CTA with copy button
- Sequence visualization timeline
- Duplicate and Delete actions

### 6. Templates Gallery
- 4 pre-built templates: SaaS Cold Email, E-commerce Follow-up, Agency Introduction, Partnership Proposal
- Each template as a card with icon, name, description, type/tone badges
- "Use Template" button that pre-fills the campaign generator

## Technical Details
- Uses `'use client'` directive
- Imports from `@/components/ui/...` for all shadcn components
- Imports from `@/lib/demo-data` for demo data
- Imports from `@/lib/utils` for `cn` utility
- Uses `lucide-react` for icons
- Uses `framer-motion` for animations (container/item variants, AnimatePresence)
- Uses `sonner` for toast notifications
- Copy-to-clipboard uses `navigator.clipboard.writeText` with toast feedback
- All state is local (useState) for demo mode
- Responsive design (mobile-first with sm/md/lg/xl breakpoints)
- Emerald/green color theme, no indigo/blue
- Dark/light mode compatible

## Additional Files Created
- `/home/z/my-project/src/components/modules/settings.tsx` - Placeholder settings module (was missing, causing compile errors)

## Verification
- ESLint passes with no errors
- Dev server compiles and serves successfully (GET / 200)
- Page renders correctly with no runtime errors
