# Deployment Guide

## Setting Up Vercel Integration

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link Your Project**:
   ```bash
   vercel link
   ```

## Setting Up GitHub Secrets

You'll need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and Variables → Actions
2. Add the following secrets:

   - `VERCEL_TOKEN`: Your Vercel access token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### How to Get These Values:

1. **VERCEL_TOKEN**:
   - Go to Vercel.com → Settings → Tokens
   - Create a new token
   - Copy the token value

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Run `vercel link` in your project directory
   - These values will be in the `.vercel/project.json` file
   - Or run: `vercel projects list` to see your project details

## Environment Variables

Make sure to set up the following environment variables in Vercel:

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add all variables from your `.env.local` file

## Custom Domain Setup (Optional)

1. Go to your project in Vercel
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Deployment Checks

- ✅ GitHub repository is connected to Vercel
- ✅ Environment variables are set in Vercel
- ✅ GitHub Actions secrets are configured
- ✅ All tests pass locally
- ✅ README.md is up to date
- ✅ vercel.json is configured
