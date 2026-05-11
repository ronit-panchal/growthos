# Vercel Production Setup Guide

## 1. Environment Variables Setup

Go to your Vercel Dashboard → Project → Settings → Environment Variables

### Required Variables:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### IMPORTANT:
- Set ALL variables (including NEXT_PUBLIC_ ones)
- Use your actual Vercel domain URL
- Use production Supabase URL
- Use production Razorpay keys

## 2. Database Connection Fix

### Supabase Configuration:
1. Go to Supabase Dashboard → Settings → Database
2. Under "Connection parameters" → "Connection pooling"
3. Enable "Connection pooling"
4. Use the "Connection string" format for DATABASE_URL

### Example:
```
DATABASE_URL=postgresql://postgres.YOUR_PASSWORD:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres
```

## 3. NextAuth Configuration

### Update auth configuration for production:
```typescript
// pages/api/auth/[...nextauth].ts or app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  providers: [
    // your providers
  ],
  callbacks: {
    async session({ session, token }) {
      // session logic
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

## 4. API Route Fixes

### Fix hardcoded localhost:
In src/app/api/teams/invite/route.ts:
```typescript
// Change this:
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// To this:
const appUrl = process.env.NEXT_PUBLIC_APP_URL
```

## 5. Build Configuration

### Update next.config.ts:
```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
```

## 6. Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy
5. Test all features

## 7. Testing Checklist

- [ ] User registration/login works
- [ ] Database queries work
- [ ] Email sending works
- [ ] Payment processing works
- [ ] All API endpoints respond
- [ ] File uploads work (if any)
- [ ] Cron jobs work (if any)

## 8. Common Issues & Fixes

### Issue: Database connection timeout
Fix: Use Supabase connection pooling

### Issue: Authentication redirects to localhost
Fix: Set NEXTAUTH_URL and NEXT_PUBLIC_APP_URL correctly

### Issue: Environment variables not loading
Fix: Check Vercel environment variables are set correctly

### Issue: CORS errors
Fix: Update CORS configuration for production domain

## 9. Monitoring

Add error tracking:
```bash
npm install @sentry/nextjs
```

## 10. Performance

Enable Vercel Analytics and Speed Insights for monitoring.
