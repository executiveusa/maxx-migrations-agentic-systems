# Vercel Monorepo Deployment Fix

## Problem

This repository is a monorepo. The Maxx Migrations product lives at `apps/maxx-web`, alongside unrelated upstream ERPNext/Frappe code at the repository root.

The failing Vercel build was building the repository root and detecting the Python/Frappe project from `pyproject.toml` instead of deploying the isolated Next.js application in `apps/maxx-web`.

The observed error was:

```txt
Error: No python entrypoint found. Set "tool.vercel.entrypoint" in pyproject.toml or define an entrypoint in one of: app.py, index.py, server.py, main.py, wsgi.py, asgi.py...
```

## Preferred Vercel project setting

In the Vercel dashboard, set the project Root Directory to:

```txt
apps/maxx-web
```

That is the clean monorepo configuration because `apps/maxx-web` contains the deployable Next.js application and its own `package.json`.

Expected dashboard settings:

```txt
Root Directory: apps/maxx-web
Framework Preset: Next.js
Build Command: next build
Install Command: npm install
Output Directory: Next.js default
```

## Repository fallback fix

A root-level `vercel.json` has also been added so the current Vercel project can build the Next.js app even if the project Root Directory is still pointed at the repository root.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm install --prefix apps/maxx-web",
  "buildCommand": "npm run build --prefix apps/maxx-web",
  "outputDirectory": "apps/maxx-web/.next"
}
```

This avoids the root Python/Frappe autodetection path and forces Vercel to install and build the isolated Maxx web app.

## Environment variables

Set the variables listed in `apps/maxx-web/.env.example` in the Vercel project's Settings → Environment Variables. Variables left unset keep the corresponding integration in setup-required mode; the app should not require every external integration to build or deploy.

## Verifying the fix

After this commit deploys, the build log should show these commands or equivalent behavior:

```txt
npm install --prefix apps/maxx-web
npm run build --prefix apps/maxx-web
```

The deployed site should resolve:

```txt
/
/app
/api/health
```

without 404s.

## If Vercel still fails

If Vercel ignores the root-level fallback or still uses Python runtime detection, set the dashboard Root Directory manually to `apps/maxx-web` and redeploy the latest `develop` commit.
