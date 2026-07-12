# Archived: Jekyll tag-page automation

This is the pre-Astro-migration mechanism for generating `/tags/<tag>/` pages:

- `tags/` — 23 hand-committed Jekyll stub pages (one per tag), each just front
  matter pointing at the `tag` layout.
- `generate-tags.yml.disabled` — a GitHub Actions workflow that scanned
  `_posts/**` on every push, created any missing `tags/<tag>.md` stub, and
  committed it back to the repo.

The Astro site replaces this with a single dynamic route
(`src/pages/tags/[tag].astro`) that computes the tag list from post front
matter at build time — same `/tags/<tag>/` URLs, no committed stub files, no
bot commits. Kept here rather than deleted per request, in case it's ever
useful for reference.
