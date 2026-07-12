# 5 Error

Bubu's personal blog — thoughts, stories, and ideas on building software, running a business, and growing a developer community. Built with [Astro](https://astro.build), hosted on GitHub Pages.

## Running it locally

You need Node.js (v22+).

```bash
npm install
npm run dev
```

Then open **http://localhost:4321**.

Other useful commands:

```bash
npm run build         # build the static site to dist/
npm run preview       # preview the production build locally
npm run check-links   # crawl dist/ for broken internal links (run after build)
```

## Writing posts

Posts live in `src/content/posts/`, named `YYYY-MM-DD-title.md` (the date is parsed from the filename; the title-cased part becomes the URL slug, e.g. `2019-08-12-scaling-your-development-process-P1.md` → `/scaling-your-development-process-P1/` — filename casing is preserved exactly, since it's part of the public URL).

Front matter:

```yaml
---
title: "Post Title"
description: "Short description, used as the homepage dek and meta description"
comments: true
keywords: "comma, separated, keywords"
published: true
tags: [software, business, community]
---
```

Set `published: false` to keep a post out of the build (drafts stay in the repo, same as before).

## Project structure

- `src/pages/` — routes: home (`index.astro`), a post (`[slug].astro`), About (`about.astro`), tag archives (`tags/[tag].astro`), the RSS feed (`feed.xml.ts`)
- `src/layouts/` — `BaseLayout` (head/meta/SEO shell), `PostLayout`, `PageLayout`
- `src/components/` — `Header`, `Footer`, `Comments` (giscus), plus `Intro`/`PostShare` (ported but currently unused, matching their status in the old Jekyll site)
- `src/content/posts/`, `src/content/pages/` — markdown content (Content Collections, schema in `src/content.config.ts`)
- `src/lib/posts.ts` — post date/slug parsing, published-post fetching, reading-time estimate
- `src/styles/` — Sass, entry point `main.scss`
- `public/` — static passthrough (images, favicon, `CNAME`)
- `archive/` — the old Jekyll tag-page automation (kept for reference, no longer used — see its README)

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds with Astro and publishes to GitHub Pages via `actions/deploy-pages`. The repo's Pages source (Settings → Pages → Build and deployment) needs to be set to **"GitHub Actions"** for this to take effect. `.github/workflows/ci.yml` runs the same build plus a broken-link check on every push/PR.
