# GrowthOS

GrowthOS is a SaaS product for agencies, consultants, and outbound teams. It combines lead capture, website audits, AI-assisted outreach, proposal generation, pricing, and owner analytics in one Next.js application.

This repo is set up to support the full customer journey:

- A public landing page that explains the product.
- A pricing page that can stay in free-beta mode until billing keys are added.
- Account creation with Supabase Auth.
- Email-confirmation-aware login with NextAuth session handling.
- A protected dashboard for day-to-day work.
- A hidden owner-only admin route at `/dashboard/admin`.

## What The Product Does

GrowthOS helps a business move from interest to offer:

1. A prospect becomes a lead.
2. The team runs a website audit or qualifies the lead manually.
3. GrowthOS generates outreach and proposal drafts.
4. The dashboard shows pipeline, deal value, and operational activity.
5. Owners can review platform-wide analytics in the hidden admin area.

## Main Product Areas

### Public marketing

- `/`
  - Explains the value proposition and workflow.
- `/pricing`
  - Shows plans and routes users into signup.
  - If Razorpay keys are missing, pricing stays in safe free-beta mode.

### Authentication

- `/register`
  - Creates a Supabase user.
  - If email confirmation is enabled in Supabase, the user is prompted to verify first.
- `/login`
  - Signs in with Supabase password auth.
  - Creates the app session through NextAuth.

### Protected app

- `/dashboard`
  - Main workspace overview with analytics and quick actions.
- `/dashboard/leads?action=new`
  - Create a new lead.
- `/dashboard/audits?action=new`
  - Run a website audit.
- `/dashboard/outreach?action=new`
  - Generate outreach content.
- `/dashboard/proposals?action=new`
  - Generate a proposal draft.
- `/dashboard/admin`
  - Hidden owner/admin route for platform analytics.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL
- Supabase Auth
- NextAuth
- Recharts
- Nodemailer
- Razorpay

## Roles And Access

- `agency_owner`
  - Default primary account role.
  - Can access the hidden admin page.
- `admin`
  - Can access the hidden admin page.
- `team_member`
  - Uses the workspace but should not access owner-level analytics.

## Important Product Behavior

### Email verification

GrowthOS supports email verification through Supabase Auth.

To make verification links work correctly on Vercel and on any device:

- Set the correct Supabase Site URL.
- Add your Vercel production domain to Supabase redirect allowlists.
- Keep `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` aligned with the deployed domain.

If confirmation is enabled in Supabase, users will:

1. Create an account.
2. Receive a confirmation email.
3. Verify on any device.
4. Return and sign in.

### Billing safe mode

Pricing and checkout are intentionally safe before billing is live.

If these env vars are missing:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Then:

- The pricing page still works.
- Users can still sign up.
- Checkout APIs return a clear "not configured" response.
- The app behaves like a free beta until billing is turned on.

## Environment Variables

Minimum required:

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional but recommended:

```env
OPENAI_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

## Local Development

Use Node.js 20.9+.

Install and run:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Deployment

This project is already shaped for Vercel deployment.

Checklist:

1. Push the repo to GitHub.
2. Connect the repo to Vercel.
3. Add all required environment variables in Vercel.
4. Confirm Supabase Site URL and redirect configuration.
5. Deploy.
6. Test signup, email verification, login, dashboard access, and the hidden admin route.

## Hidden Admin Route

Owner analytics live at:

```txt
/dashboard/admin
```

This page is intended for:

- The founder
- Agency owners
- Platform admins

It is not meant to be part of the public marketing flow.

## Data Model Summary

Main Prisma models:

- `User`
- `Lead`
- `AuditJob`
- `OutreachCampaign`
- `Proposal`
- `Activity`
- `Subscription`
- NextAuth support models: `Account`, `Session`, `VerificationToken`

## Operational Notes For The Team

### For product owners

- Use the public pages to explain value clearly.
- Use pricing in free-beta mode until billing is ready.
- Use `/dashboard/admin` to review adoption and internal product health.

### For operators / employees

- Start with leads.
- Run audits when you need a stronger sales angle.
- Generate outreach after qualification.
- Generate proposals when a lead shows buying intent.

### For developers

- App data is scoped from the authenticated session.
- Supabase Auth and Prisma user records are synchronized in the app flow.
- Public checkout should remain disabled until billing keys are added.
- Avoid reintroducing client-supplied `userId` access patterns for protected data.

## Current Known Gaps

These are the main remaining limitations to address before a larger commercial rollout:

- Team management is still memory-backed rather than fully relational.
- Usage tracking is still memory-backed rather than persisted.
- Billing is intentionally inactive until Razorpay keys are added.
- Fresh dependency lock alignment may need `npm install` once in your final clean repo state.

## Repo Cleanup Done

This repo has already been cleaned to remove:

- Duplicate dashboard fetch components that were no longer used
- Extra markdown setup files
- Duplicate audit route files
- Template and helper folders that were not part of the product flow

## Recommended Final Manual Test

Before calling it production-ready, test this full story on Vercel:

1. Visit the landing page.
2. Open pricing.
3. Create an account.
4. Confirm the email link.
5. Sign in.
6. Create a lead.
7. Run an audit.
8. Generate outreach.
9. Generate a proposal.
10. Visit `/dashboard/admin` with an owner account.

If all of that works on the deployed domain, the product flow is in strong shape.
