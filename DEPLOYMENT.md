# Ram Charan Fan Community - Deployment Guide

## Overview

This is a premium cinematic fan community platform built with Next.js 16, Framer Motion, and Supabase. This guide covers production deployment and configuration.

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- Vercel account (recommended for deployment)
- Environment variables configured

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ram-charan-fans
npm install
# or
yarn install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and fill in your configuration:

```bash
cp .env.example .env.local
```

### 3. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the database migration:
   ```bash
   psql -h <supabase-host> -U postgres -d postgres -f scripts/init-db.sql
   ```
3. Copy your project URL and anon key to `.env.local`

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your application.

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Connect GitHub Repository

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Click "Continue"

#### Step 2: Configure Environment Variables

In the Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `ADMIN_API_KEY`

#### Step 3: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your site
3. Your site will be live at `https://<project>.vercel.app`

### Option 2: Self-Hosted Deployment

#### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t ram-charan-fans .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... ram-charan-fans
```

#### Using PM2

```bash
npm install -g pm2

npm run build
pm2 start "npm start" --name "ram-charan-fans"
```

## Database Setup

### Supabase Tables

The database includes the following tables:

#### `fan_creations`
- `id` (UUID, primary key)
- `title` (TEXT)
- `creator` (TEXT)
- `email` (TEXT)
- `category` (TEXT)
- `description` (TEXT)
- `image_url` (TEXT)
- `status` (TEXT: pending/approved/rejected)
- `created_at` (TIMESTAMP)

#### `admins`
- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `password_hash` (TEXT)
- `created_at` (TIMESTAMP)

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on fan_creations
ALTER TABLE fan_creations ENABLE ROW LEVEL SECURITY;

-- Only approved submissions visible to public
CREATE POLICY "Public can view approved"
  ON fan_creations FOR SELECT
  USING (status = 'approved');

-- Admin can see all
CREATE POLICY "Admin can see all"
  ON fan_creations FOR ALL
  USING (auth.jwt() -> 'role' = 'admin');
```

## Admin Setup

### Default Admin Credentials

The system comes with demo credentials. Change these in production:

- Email: `admin@ramcharan.com`
- Password: `admin123`

### Change Admin Credentials

1. Hash your new password using bcrypt
2. Update in Supabase dashboard
3. Set `ADMIN_PASSWORD_HASH` in environment variables

## Optimization Checklist

- [x] Cinematic preloader animation (3 second timeout)
- [x] Smooth page transitions with Framer Motion
- [x] Scroll progress indicator
- [x] Optimized image loading
- [x] Lazy loading for gallery items
- [x] Database indexing for queries
- [x] API rate limiting ready
- [x] Compression enabled by default in Next.js

## Performance Metrics

Target performance:
- Lighthouse Score: 90+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **API Authentication**: Admin routes require bearer token
3. **Database RLS**: Row Level Security policies configured
4. **CORS**: Configure allowed origins in production
5. **Rate Limiting**: Implement on submission endpoints
6. **Input Validation**: All inputs sanitized before database operations
7. **HTTPS**: Enforce HTTPS in production

## Troubleshooting

### Supabase Connection Issues

```bash
# Test connection
curl -X GET "https://<supabase-url>/rest/v1/fan_creations?limit=1" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <anon-key>"
```

### Admin Panel Access

1. Clear browser cache and cookies
2. Verify `ADMIN_API_KEY` is set
3. Check browser console for auth errors
4. Verify JWT token in localStorage

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Monitoring and Analytics

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Vercel Analytics
- **Performance**: Web Vitals
- **Database**: Supabase Dashboard

### Add Google Analytics

Update `app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review moderation queue
2. **Monthly**: Check performance metrics
3. **Monthly**: Update dependencies: `npm update`
4. **Quarterly**: Security audit
5. **As needed**: Database backups (Supabase handles this)

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs
4. Open an issue in the repository

## License

This project is for the Ram Charan fan community. Respect all copyright and intellectual property rights.
