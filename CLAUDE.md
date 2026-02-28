# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog at www.5error.com ("5 Error") built with Jekyll 3.x, hosted on GitHub Pages. No JavaScript framework — pure Ruby/Jekyll stack.

## Common Commands

```bash
bundle install                              # Install Ruby dependencies
bundle exec jekyll serve                   # Dev server at http://localhost:4000
bundle exec jekyll serve --drafts          # Include draft posts
bundle exec jekyll build                   # Build to _site/
bundle exec htmlproofer ../_site --disable-external  # Validate HTML
script/cibuild.sh                          # Full CI build (build + validate)
```

## Architecture

**Content flow:** Markdown posts in `_posts/` → Jekyll processes with layouts from `_layouts/` → static HTML output in `_site/` (excluded from git).

**Layouts:**
- `default.html` — base layout with header/footer
- `post.html` — individual blog post pages
- `page.html` — static pages (e.g., About)

**Styling:** SCSS in `assets/scss/` compiled by Jekyll. Entry point is `main.scss`, which imports partials. Design tokens live in `_variables.scss`. Bourbon (v7.3.0) provides SCSS mixins.

**Theme:** thinkspace v2.5.0 (minimalist Jekyll theme, defined in `thinkspace.gemspec`).

## Writing Posts

Posts go in `_posts/` with the naming convention `YYYY-MM-DD-title.md`. Required front matter:

```yaml
---
layout: post
title: "Post Title"
description: "Short description"
comments: true
keywords: "comma, separated, keywords"
published: true
---
```

## Git Workflow

Feature branches for posts and major changes, merged to master via PRs. GitHub Pages deploys from master automatically. Travis CI (`.travis.yml`) runs `script/cibuild.sh` on master and gh-pages branches.
