# Vercel Deployment Guide

This guide will help you deploy CompanyVoice to Vercel with Vercel Postgres (free tier).

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub account (to push your repository)
- Git installed locally

## Step 1: Ensure GitHub Repository

If you haven't already pushed your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/companyvoice.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and click "New Project"
2. Select "Import Git Repository" and choose your `companyvoice` repo
3. **Framework**: Select "Other" (we have a custom setup)
4. **Root Directory**: Leave empty (project root)
5. Click "Deploy"

Vercel will now build your project. This may take 2-5 minutes.

## Step 3: Set Up Vercel Postgres

After initial deployment completes:

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click "Create New" → "Postgres"
3. Name it `companyvoice` 
4. Choose region closest to you
5. Click "Create"

Vercel will automatically add a `POSTGRES_PRISMA_URL` environment variable (and others) to your project.

## Step 4: Configure Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these variables (some may already exist from Postgres setup):

   ```
   DATABASE_URL = [AUTO-FILLED from Postgres setup]
   VITE_API_BASE_URL = https://YOUR_PROJECT.vercel.app
   JWT_SECRET = [generate: openssl rand -base64 32]
   JWT_REFRESH_SECRET = [generate: openssl rand -base64 32]
   NODE_ENV = production
   ```

3. Click "Save"

**To generate secrets:**
```bash
# On Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Or on Mac/Linux:
openssl rand -base64 32
```

## Step 5: Deploy with Database

1. Go to **Deployments** tab
2. Click "Redeploy" on your latest deployment (to apply new env vars)

Or push a new commit:
```bash
git add .
git commit -m "Configure Vercel Postgres"
git push
```

## Step 6: Initialize Database Schema

After deployment completes, run the database initialization:

**Option A: Using curl**
```bash
curl -X POST https://YOUR_PROJECT.vercel.app/api/admin/init-db \
  -H "Content-Type: application/json" \
  -d '{"adminPassword":"AdminPassword123"}'
```

**Option B: Using an admin endpoint** (if you have one set up)

This creates all tables and seeds initial data.

## Step 7: Test Your Deployment

1. Visit `https://YOUR_PROJECT.vercel.app/`
2. You should see the CompanyVoice login page
3. Test login with demo credentials:
   - Admin: `admin@companyvoice.com` / `AdminPassword123`
   - Employee: `john@company.com` / `Pass123456`

(These are created during database initialization)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set in Vercel env vars
- Check Vercel Postgres status in Storage tab
- Redeploy after setting DATABASE_URL

### CORS Errors
- Ensure `VITE_API_BASE_URL` in env vars matches your Vercel domain
- Frontend should use relative paths `/api/*` automatically

### Cold Start Issues
- First request may take 10-15 seconds (normal for serverless)
- Subsequent requests are faster
- Database connections are pooled automatically

### Deployment Failed
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are listed in `server/package.json`
3. Verify `api/index.ts` exists at project root
4. Try redeploying: Dashboard → Deployments → Redeploy

## Local Development Setup

For local development with MySQL:

```bash
# Install dependencies
npm install
npm --prefix server install
npm --prefix client install

# Create local MySQL database
mysql -u root -p -e "CREATE DATABASE companyvoice;"

# Start development servers
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5000

## Post-Deployment

### Database Migrations
For schema changes in production:
1. Update models in `server/src/models/index.ts`
2. Deploy to Vercel (Sequelize auto-syncs on startup)
3. Monitor deployment logs for sync status

### Viewing Logs
- In Vercel: **Deployments** → Click deployment → **Functions**
- Check browser console for frontend errors
- Use Vercel Analytics for performance monitoring

### Backup & Recovery
Vercel Postgres includes automatic backups. To restore:
1. Go to your Postgres database in Storage tab
2. Look for backup/recovery options
3. Contact Vercel support if needed

## Optional: Custom Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration shown
4. Update `VITE_API_BASE_URL` if using custom domain

## Database Comparison

| Feature | Local MySQL | Vercel Postgres |
|---------|-----------|-----------------|
| Cost | Free | Free (tier) |
| Setup | Manual | Automatic |
| Maintenance | You manage | Managed by Vercel |
| Backups | Manual | Automatic |
| Performance | Local only | Global CDN + DB |

## Scaling

- **Free Tier**: 10 connections, suitable for development
- **Paid Tier**: Unlimited connections, auto-scaling
- Both tiers included with Vercel Pro

For production traffic, consider upgrading to Vercel Pro or Postgres Pro.

## Environment Variables Reference

```env
# Auto-generated by Vercel Postgres
DATABASE_URL=postgres://user:password@host:5432/db

# Manual configuration
VITE_API_BASE_URL=https://YOUR_PROJECT.vercel.app
JWT_SECRET=<random 32-byte string>
JWT_REFRESH_SECRET=<random 32-byte string>
NODE_ENV=production
```

## Common Commands

```bash
# Deploy current branch
git push

# Check deployment status
vercel --prod

# View live logs
vercel logs

# Roll back to previous deployment
# (available in Vercel dashboard)
```

## Getting Help

- Vercel Docs: https://vercel.com/docs
- Vercel Postgres Docs: https://vercel.com/docs/storage/postgres
- Sequelize Docs: https://sequelize.org/
- GitHub Issues: https://github.com/YOUR_USERNAME/companyvoice/issues

## Next Steps

After successful deployment:
1. [ ] Create admin account and verify login
2. [ ] Set up custom domain (optional)
3. [ ] Configure error monitoring (Sentry, LogRocket)
4. [ ] Enable Vercel Analytics
5. [ ] Set up GitHub branch protection
6. [ ] Create staging deployment with preview
7. [ ] Configure email notifications
8. [ ] Monitor performance metrics
