# Task: Create Proposal Generator Module

## Summary
Created a comprehensive Proposal Generator module at `/home/z/my-project/src/components/modules/proposals.tsx` (1476 lines).

## What was built

### 1. Header Section
- Title "Proposal Generator" with subtitle
- "New Proposal" button that opens a Dialog

### 2. Proposal Stats Cards
- 4 stat cards: Drafts, Sent, Viewed, Accepted
- Color-coded icons and backgrounds (gray/teal/amber/emerald)
- Animated with framer-motion

### 3. Proposal List
- Search input with filter by status
- Filter buttons: All, Draft, Sent, Viewed, Accepted
- Card-based list items showing: title, status badge, client name, email, relative time, total value, line items count
- Click to open detail sheet
- Animated entrance with AnimatePresence

### 4. New Proposal Form (Dialog)
- Title, Client Name, Client Email inputs
- "Generate with AI" button that simulates AI content generation (2s delay)
- Sections builder: add/remove sections with title + content, up/down reorder buttons
- Pricing table builder: add/remove line items with item, description, quantity, unit price
- Auto-calculated total
- "Save as Draft" and "Send Proposal" buttons

### 5. Proposal Detail/Edit View (Sheet)
- Status badge in header
- Action buttons: Edit/Preview toggle, Send (for drafts), Share, Export PDF, Delete
- Status Timeline: Draft → Sent → Viewed → Accepted with dates and relative times
- Edit mode: sections editor + pricing editor with add/remove/reorder
- Preview mode: ProposalPreviewCard component
- Delete confirmation via AlertDialog

### 6. Proposal Preview Card
- Professional branded header with gradient (emerald/teal)
- Company branding placeholder (GrowthOS Agency)
- Proposal title, client info, date
- Formatted sections with content
- Pricing table with items, qty, price, total
- Total investment highlighted in emerald

## Technical Details
- All state is local (useState) for demo mode
- Uses `demoProposals` from `@/lib/demo-data`
- Emerald/green color theme, no indigo/blue
- Responsive design (mobile-first)
- Framer Motion animations
- Sonner toasts for all actions
- Proper status badges with colors: draft=gray, sent=teal, viewed=amber, accepted=emerald, rejected=red

## Files Modified
- Created: `/home/z/my-project/src/components/modules/proposals.tsx`
- Modified: `/home/z/my-project/src/lib/store.ts` (default page set to 'proposals')

## Lint Status
- Proposals module: 0 errors
- Pre-existing errors in leads.tsx (not related to this task)
