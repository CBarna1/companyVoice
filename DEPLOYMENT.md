# Vercel Deployment Guide

This guide will help you deploy CompanyVoice to Vercel with a MySQL database on PlanetScale.

## Prerequisites

- Vercel account (https://vercel.com)
- PlanetScale account (https://planetscale.com)
- GitHub account (to push your repository)
- Git installed locally

## Step 1: Set Up GitHub Repository

1. Go to https://github.com/new and create a new repository named `companyvoice`
2. In your project directory, add the remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/companyvoice.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up PlanetScale Database

1. Go to https://planetscale.com and sign up/log in
2. Click "Create new database" → Name it `companyvoice`
3. Choose the region closest to you
4. Click "Create database"
5. Once created, go to "Integrations" and copy your MySQL connection string
6. It should look like: `mysql://user:password@host/db`

## Step 3: Set Up Vercel Deployment

1. Go to https://vercel.com and click "New Project"
2. Select "Import Git Repository" and choose your `companyvoice` repo
3. **Framework**: Select "Other" (we have a custom setup)
4. **Root Directory**: Leave empty (it's the project root)
5. Click "Deploy"

## Step 4: Configure Environment Variables

After Vercel creates the project:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

   ```
   DATABASE_URL = mysql://user:password@host/db
   VITE_API_BASE_URL = https://YOUR_PROJECT.vercel.app
   JWT_SECRET = (generate a random string, e.g., openssl rand -base64 32)
   JWT_REFRESH_SECRET = (generate another random string)
   NODE_ENV = production
   ```

3. Click "Save"

## Step 5: Deploy

1. Go to **Deployments** tab
2. Click "Redeploy" on the latest deployment, or
3. Push a new commit to trigger automatic deployment:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

## Step 6: Initialize Database

After first deployment:

1. Use PlanetScale console to run the database schema:
   - Go to your PlanetScale database
   - Click "Console"
   - Paste contents of `DATABASE_SCHEMA.sql` and run

2. Or seed via API endpoint:
   - Make a POST request to `/api/admin/seed` with admin auth
   - (This endpoint should be restricted in production)

## Verification

1. Visit `https://YOUR_PROJECT.vercel.app/`
2. Check the frontend loads
3. Test login with demo credentials:
   - Admin: admin@companyvoice.com / AdminPassword123
   - Employee: john@company.com / Pass123456

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel env vars
- Check PlanetScale IP whitelist allows Vercel IPs (usually automatic)
- Test connection locally first with the same URL

### CORS Errors
- Ensure `VITE_API_BASE_URL` matches your Vercel domain
- Frontend API calls should use `/api/*` (relative) or the env var

### Cold Start Issues
- First request may take 10-15 seconds (normal for serverless)
- Database connections are pooled automatically

### API Not Found Errors
- Verify `api/index.ts` exists at project root
- Check Vercel build logs for errors
- Ensure all dependencies are in `server/package.json`

## Post-Deployment

### Update Frontend API URL
The frontend should use relative paths (`/api/*`) which automatically work with the Vercel deployment.

If using environment variables:
- Local: `VITE_API_BASE_URL=http://localhost:5000`
- Production: Set in Vercel env vars

### Database Migrations
For schema changes in production:
1. Update models in `server/src/models/index.ts`
2. Get a PlanetScale admin connection
3. Run migrations or use the PlanetScale console

### Monitoring
- View logs: **Deployments** → Click deployment → **Functions**
- Set up error tracking with Sentry (optional)

## Optional: Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Update `VITE_API_BASE_URL` in env vars if needed

## Scaling Considerations

- **Database**: PlanetScale auto-scales
- **API**: Vercel handles scale automatically
- **Frontend**: Served from CDN automatically
- **Costs**: Generally free tier for hobby projects; check pricing

## Next Steps

- Set up GitHub Actions for automated tests
- Add error monitoring (Sentry, LogRocket)
- Configure database backups
- Set up custom email provider for notifications
- Monitor analytics and performance

For questions or issues, check:
- Vercel docs: https://vercel.com/docs
- PlanetScale docs: https://docs.planetscale.com
