# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog at www.5error.com ("5 Error") built with Astro, hosted on GitHub Pages via GitHub Actions. Static site, no client-side framework — content is authored as Markdown.

## Common Commands

```bash
npm install                # Install dependencies
npm run dev                 # Dev server at http://localhost:4321
npm run build                # Build to dist/
npm run preview              # Preview the production build
npm run check-links          # Crawl dist/ for broken internal links (run after build)
```

## Architecture

**Content flow:** Markdown posts in `src/content/posts/` → validated against the schema in `src/content.config.ts` → rendered through `src/layouts/PostLayout.astro` at the route defined in `src/pages/[slug].astro` → static HTML output in `dist/` (excluded from git).

**Layouts:**
- `src/layouts/BaseLayout.astro` — the `<html>` shell: head/meta/SEO, Header/Footer, global styles
- `src/layouts/PostLayout.astro` — individual blog post pages (wraps `BaseLayout`)
- `src/layouts/PageLayout.astro` — static pages, e.g. About (wraps `BaseLayout`)

**Routing:**
- `src/pages/index.astro` — home (featured post + reverse-chronological list)
- `src/pages/[slug].astro` — one route per post; `getStaticPaths()` derives params from `src/content/posts/`
- `src/pages/tags/[tag].astro` — one route per tag, computed at build time from post front matter (no per-tag files to maintain)
- `src/pages/about.astro` — About page, content from `src/content/pages/about.md`
- `src/pages/feed.xml.ts` — RSS feed via `@astrojs/rss`

**Styling:** Sass in `src/styles/`, imported once from `BaseLayout.astro`. Entry point is `main.scss`, which imports partials. Design tokens live in `_variables.scss`.

**Post slugs/dates:** Posts keep the Jekyll-era `YYYY-MM-DD-title.md` filename convention. `src/content.config.ts` uses a custom `generateId` that preserves the filename exactly (no lowercasing) so existing URLs — and the giscus comment threads mapped to them by pathname — don't change. `src/lib/posts.ts` parses the date/slug back out of that id.

**Code blocks:** Syntax highlighting is Shiki's built-in `one-dark-pro` theme (configured in `astro.config.mjs`), chosen to match the site's original Rouge-based "Atom One Dark" palette.

## Writing Posts

Posts go in `src/content/posts/` with the naming convention `YYYY-MM-DD-title.md`. Front matter:

```yaml
---
title: "Post Title"
description: "Short description"
comments: true
keywords: "comma, separated, keywords"
published: true
tags: [software, business, community]
---
```

Set `published: false` to exclude a post from the build (drafts stay in the repo).

## Git Workflow

Feature branches for posts and major changes, merged to master via PRs. `.github/workflows/ci.yml` builds and link-checks every push/PR. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to `master` (requires the repo's Pages source set to "GitHub Actions").
