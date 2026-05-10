# GrowthOS

**AI-Powered Lead Generation & Agency Operating System**

GrowthOS is a comprehensive SaaS platform designed for agencies and businesses to accelerate growth through intelligent lead capture, AI-powered website audits, automated outreach campaigns, and professional proposal generation.

**Current codebase:** production-oriented foundation—public marketing pages, Supabase-backed auth (NextAuth), Postgres/Prisma API routes, optional Razorpay, and React Email hooks. Full CRM-style dashboards are intentionally **not** bundled as demo UI so you ship real customer data only.

![GrowthOS](https://img.shields.io/badge/GrowthOS-v0.2.0-emerald)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![Prisma](https://img.shields.io/badge/Prisma-6-brightgreen)

---

## Table of Contents

- [What is GrowthOS?](#what-is-growthos)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Features Overview](#features-overview)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## What is GrowthOS?

GrowthOS is an all-in-one growth platform that combines:

- **Lead Management**: A full-featured CRM with Kanban pipeline view, lead scoring, and contact management
- **AI Website Audits**: Automated website analysis providing SEO, UX, performance, and accessibility scores with actionable recommendations
- **AI Outreach Generator**: Intelligent campaign creation with customizable sequences for email and LinkedIn outreach
- **Proposal Builder**: Professional proposal creation with customizable sections, pricing tables, and status tracking
- **Billing & Subscriptions**: Plan management with usage tracking and payment history
- **Admin Dashboard**: Platform analytics, user management, and system monitoring

The platform is built with a modern emerald/green theme, supports dark/light mode, and is fully responsive across desktop, tablet, and mobile devices.

---

## Key Features

### 1. Dashboard
- **KPI Cards**: Real-time metrics for revenue, leads, conversions, and proposals with sparkline charts
- **Revenue Analytics**: Interactive area chart showing monthly revenue trends
- **Lead Sources**: Pie chart visualization of lead acquisition channels
- **Pipeline Overview**: Bar chart showing leads across sales stages
- **Activity Feed**: Real-time stream of platform activities
- **Team Performance**: Leaderboard showing team member contributions
- **AI Usage Stats**: Track AI credit consumption and limits

### 2. Leads CRM
- **Kanban Pipeline**: Drag-and-drop interface with 7 stages (New, Contacted, Qualified, Proposal, Negotiation, Won, Lost)
- **Table View**: Sortable and filterable data grid with quick actions
- **Lead Scoring**: Automatic scoring based on engagement and profile data
- **Import/Export**: CSV import and export functionality
- **Lead Detail Sheet**: Comprehensive view with notes, timeline, and quick actions
- **Search & Filter**: Advanced filtering by status, source, score, and value

### 3. AI Website Audit
- **Website Scanner**: Enter any URL to run a comprehensive analysis
- **Progress Tracking**: Real-time progress indicator during scanning
- **Score Breakdown**: Individual scores for SEO, UX, Performance, and Accessibility
- **Findings Report**: Categorized issues with severity levels (High, Medium, Low)
- **AI Recommendations**: Actionable suggestions for improvement
- **Export Reports**: Download detailed audit reports
- **Audit History**: View all past audits with comparison capability

### 4. AI Outreach Generator
- **Campaign Creator**: AI-powered generation of outreach campaigns
- **Template Gallery**: 6 pre-built templates (Cold SaaS, E-commerce Follow-up, LinkedIn Connection, etc.)
- **Sequence Builder**: Visual timeline for multi-step outreach sequences
- **Tone Customization**: Professional, Casual, Friendly, or Assertive tones
- **Industry Targeting**: Customizable for different industries
- **Campaign Management**: Draft, Active, Paused, and Completed status tracking
- **Copy to Clipboard**: Quick copy for subject lines, content, and CTAs

### 5. Proposal Generator
- **Proposal Builder**: Create professional proposals with customizable sections
- **Pricing Tables**: Dynamic pricing with line items, quantities, and totals
- **Status Timeline**: Track proposal lifecycle (Draft → Sent → Viewed → Accepted/Rejected)
- **Client Preview**: Shareable proposal view for clients
- **Export to PDF**: Generate downloadable proposal documents
- **Templates**: Save and reuse proposal sections

### 6. Billing & Subscriptions
- **Plan Management**: View current plan and usage statistics
- **Pricing Grid**: Compare Free, Starter, Pro, and Enterprise plans
- **Payment History**: Track invoices and payments
- **Usage Analytics**: Monitor AI credits, audits, and proposals
- **Subscription Controls**: Upgrade, downgrade, or cancel subscriptions

### 7. Admin Panel
- **Platform Stats**: Total users, active users, revenue, and MRR
- **Revenue Chart**: Monthly recurring revenue tracking
- **User Management**: View and manage all platform users
- **AI Usage Analytics**: Platform-wide AI credit consumption
- **System Settings**: Configure platform parameters
- **Audit Log**: Track all administrative actions

### 8. Settings
- **Profile Management**: Update user profile and avatar
- **Notification Preferences**: Configure email and in-app notifications
- **Team Management**: Add/remove team members (Pro/Enterprise)
- **Integrations**: Connect third-party tools
- **Security Settings**: Password changes and 2FA (Enterprise)
- **Danger Zone**: Account deletion and data export

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - Type-safe development
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful accessible components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Smooth page transitions
- **Icons**: [Lucide React](https://lucide.dev/) - Modern icon library
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **Session**: [NextAuth.js](https://next-auth.js.org/) client session where needed
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation

### Backend
- **API**: Next.js App Router API routes
- **Database**: [Prisma](https://www.prisma.io/) ORM with PostgreSQL (e.g. Supabase)
- **AI Integration**: [z-ai-web-dev-sdk](https://www.npmjs.com/package/z-ai-web-dev-sdk) for AI features when configured
- **Authentication**: NextAuth.js (credentials backed by Supabase Auth)

### Development Tools
- **Linting**: ESLint with Next.js config
- **Build**: Next.js with Turbopack for fast builds
- **Package Manager**: npm

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/growthos.git
   cd growthos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
growthos/
├── src/app/
│   ├── (marketing)/     # Public landing + pricing
│   ├── (auth)/          # Login + register
│   ├── (dashboard)/     # Protected app (session required)
│   ├── api/             # REST endpoints (leads, audits, auth, payments, teams, …)
│   ├── layout.tsx
│   └── globals.css
├── src/components/      # UI + providers (shadcn/ui, SessionProvider, …)
├── src/lib/             # auth, db, email, tenant, plan limits, Razorpay helper
├── emails/              # React Email templates
├── prisma/schema.prisma # PostgreSQL schema
├── public/
├── middleware.ts        # NextAuth route protection
└── .env.example
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

See [.env.example](.env.example) for the full template. Minimum for local/dev:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="generate-a-long-random-secret"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

Billing (Razorpay) and SMTP are optional until you enable payments and transactional email.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint on all files |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:reset` | Reset database (⚠️ destructive) |

---

## Features Overview

### Demo Mode
The application includes comprehensive demo data that loads automatically when external services (like AI APIs) are unavailable. This ensures the platform is fully functional for demonstrations and development without requiring API keys.

### Responsive Design
All modules are optimized for:
- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, adapted grid layouts
- **Mobile**: Horizontal scroll for tables/Kanban, stacked layouts

### Dark/Light Mode
Built-in theme support with:
- System preference detection
- Manual toggle in UI
- Persistent preference storage
- Consistent emerald color scheme across both modes

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check |
| `/api/leads` | GET/POST | List/create leads |
| `/api/leads/[id]` | GET/PUT/DELETE | Lead operations |
| `/api/audits` | GET/POST | List/create audits |
| `/api/audits/[id]` | GET | Get audit details |
| `/api/audits/run` | POST | Run new website audit |
| `/api/outreach` | GET/POST | List/create campaigns |
| `/api/outreach/generate` | POST | AI generate campaign |
| `/api/proposals` | GET/POST | List/create proposals |
| `/api/proposals/[id]` | GET/PUT/DELETE | Proposal operations |
| `/api/activities` | GET | Get recent activities |
| `/api/stats` | GET | Get dashboard statistics |

---

## Database Schema

### Models

- **User**: Platform users with roles (agency_owner, team_member, admin)
- **Lead**: CRM leads with status tracking and scoring
- **AuditJob**: Website audit records with scores and findings
- **OutreachCampaign**: AI-generated outreach campaigns
- **Proposal**: Client proposals with sections and pricing
- **Activity**: Activity feed entries
- **Subscription**: User subscription and billing info

---

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/growthos)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

### Self-Hosting

The application can be self-hosted using:
- **Docker**: Build and run in a container
- **PM2**: Process manager for Node.js
- **Systemd**: Linux service management

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Maintain emerald/green color scheme
- Ensure responsive design for all new features
- Add demo data for any new data models
- Write meaningful commit messages

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, please:
- Open an issue on GitHub
- Contact the maintainers
- Check the documentation

---

## Roadmap

- [ ] Multi-language support (i18n)
- [ ] Advanced analytics with custom date ranges
- [ ] Email integration (SendGrid, Mailgun)
- [ ] Calendar integration (Google, Outlook)
- [ ] Webhook support for external integrations
- [ ] Mobile app (React Native)
- [ ] AI-powered lead scoring
- [ ] Automated follow-up sequences
- [ ] Custom report builder
- [ ] White-label customization

---

**Built with ❤️ for growth-focused agencies and businesses**

---

## Search Bar Guide (Now Workable)

The top search bar is now connected to a command search system.

### How to use it

1. Click the search bar in top navigation, or press `Ctrl + K` / `Cmd + K`
2. Type what you want
3. Select an item from results and press Enter

### What you can search

You can search by module name, keyword, and quick action.

- **Pages / modules**
  - Dashboard (home, overview, analytics, KPI)
  - Leads (CRM, pipeline, prospects, contacts)
  - AI Audit (SEO, accessibility, performance, UX)
  - Outreach (campaigns, cold email, LinkedIn, sequences)
  - Proposals (quotes, pricing, client proposals)
  - Billing (subscription, invoices, plan, usage)
  - Admin (users, MRR, logs, system) - visible for admin/agency owner only
  - Settings (profile, account, notifications, preferences)

- **Quick actions**
  - Mark all notifications as read
  - Toggle dark/light theme
  - Open profile settings
  - Open billing

---

## Business Handbook (Owner + Customer Perspective)

This section explains how to sell, run, and deliver GrowthOS as a SaaS product.

## 1) What GrowthOS sells

GrowthOS sells an **AI-enabled revenue operations workspace** for agencies and service teams.

Core value:
- Capture and organize leads faster
- Audit client websites with actionable insights
- Generate outreach campaigns quickly
- Create professional proposals and track progress
- Manage usage, subscriptions, and performance in one platform

---

## 2) Ideal customers

- Digital marketing agencies
- Web/design agencies
- Lead generation teams
- Freelance consultants scaling to small teams
- B2B service businesses with outbound sales workflows

---

## 3) Pricing/packaging strategy (recommended)

Use tiered plans based on seats + AI usage + feature access.

- **Free/Starter**
  - Basic CRM + limited audits + limited outreach generations
  - 1 seat, limited monthly AI credits
- **Pro**
  - Full workflow for growing agencies
  - More seats, higher AI limits, proposal exports
- **Enterprise**
  - Advanced controls and highest limits
  - Priority support, security controls, custom onboarding

Upsell levers:
- Additional AI credit packs
- Extra user seats
- White-label/report customization
- Priority support SLA

---

## 4) How to sell this SaaS

### Positioning message

"GrowthOS helps agencies turn leads into revenue with AI-powered audits, outreach, and proposals in one place."

### Sales process

1. Demo dashboard + lead pipeline + one audit run
2. Show outreach generation and proposal flow end-to-end
3. Estimate time saved per month
4. Offer a trial with onboarding checklist
5. Convert to paid plan with usage-based upsell

### Channels to acquire users

- Content marketing (SEO around agency ops + lead generation)
- Founder-led outreach (email + LinkedIn)
- Partner channels (marketing consultants, agency coaches)
- Product-led onboarding with demo data + in-app prompts

---

## 5) What the SaaS owner (you) can manage

As platform owner/operator, you can manage:

- Product modules and feature rollout
- User lifecycle (trial, active, churn-risk)
- Subscriptions and billing plans
- Usage limits (AI credits, audits, proposals)
- Platform analytics (MRR, active users, usage patterns)
- Admin governance and system settings
- Notifications and activity logs for operational monitoring

### Weekly owner checklist

- Review MRR and active user trends
- Check audit/outreach/proposal usage by plan
- Identify churn risks (low engagement users)
- Push feature improvements and onboarding updates
- Review support tickets and friction points

---

## 6) What your customer gets after purchase

When a paying customer signs up, they get:

- Their own account and workspace context
- Access to product modules based on plan
- A top-level app navigation with all enabled modules
- Billing controls and usage visibility
- Settings for profile/team/preferences
- Demo-safe fallback behaviors when external AI is unavailable

### If customer is an owner/admin inside their account

They get access to:
- Admin panel (user analytics, usage, operational metrics)
- Team-level management capabilities
- Subscription and billing management
- System-level account settings (within their tenant/workspace context)

---

## 7) Customer-facing feature list

### Dashboard
- KPI overview, revenue trend charts, team/activity visibility

### Leads CRM
- Pipeline stages, lead records, filters, status movement

### AI Audit
- URL-based audit generation with SEO/UX/performance/accessibility scoring
- Findings + suggestions output

### Outreach
- Campaign generation and sequence management

### Proposals
- Proposal drafting, pricing structure, status tracking

### Billing
- Plan/usage visibility and subscription context

### Settings
- Profile/preferences and account controls

### Admin (role-based)
- Platform/team analytics and administrative actions

---

## 8) Operational model when selling to many users

Recommended model:
- Keep role-based access control enabled (`admin`, `agency_owner`, `team_member`)
- Enforce plan limits at API level for consistency
- Track all key actions in activity logs
- Use onboarding templates for faster activation
- Monitor leading indicators: time-to-first-audit, campaigns created, proposals sent

---

## 9) Implementation status in this repo

Current project already includes:
- Next.js app shell with module routing
- API routes for leads, audits, outreach, proposals, stats, activities
- Prisma-backed persistence
- Role-aware navigation and admin visibility
- Search command bar for module navigation and quick actions

This makes GrowthOS ready for:
- Internal operations
- Pilot customers
- Staged commercial rollout with plan-based monetization
