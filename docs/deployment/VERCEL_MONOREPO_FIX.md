# Vercel Monorepo Deployment Fix

This repository is a monorepo. The Maxx Migrations product lives at
`apps/maxx-web`, alongside unrelated products (`erpnext`, `banking`) at the
repo root. Deploying from the repo root fails or builds the wrong app.

## Required Vercel project settings

1. In the Vercel dashboard, open the project connected to this repo.
2. Under **Settings → General → Root Directory**, set:
   ```
   apps/maxx-web
   ```
3. Framework Preset should auto-detect as **Next.js** once the root
   directory is set. `apps/maxx-web/vercel.json` also pins this explicitly:
   ```json
   { "$schema": "https://openapi.vercel.sh/vercel.json", "framework": "nextjs" }
   ```
4. Build command: `next build` (default). Install command: `npm install`
   (default). Do not override these to run from the repo root.
5. Do not deploy from the repository root — the root has no `package.json`
   suitable for a single-app Next.js build and will resolve dependencies
   incorrectly.

## Environment variables

Set the variables listed in `apps/maxx-web/.env.example` in the Vercel
project's **Settings → Environment Variables**. Variables left unset keep
the corresponding integration in `setup_required` mode — the app does not
require every integration to build or deploy.

## Verifying the fix

After setting the Root Directory, trigger a redeploy. The build log should
show `next build` running from `apps/maxx-web`, and the deployed site
should resolve `/`, `/app`, and `/api/health` without 404s.
