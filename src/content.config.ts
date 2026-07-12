import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Post ids keep the `YYYY-MM-DD-slug` filename convention (see src/lib/posts.ts
// for parsing the date/slug back out) — same authoring convention as before,
// just as markdown files in a content collection instead of Jekyll `_posts/`.
//
// Jekyll derives a post's `:title` permalink directly from the filename
// as-is (no lowercasing/re-slugifying) — e.g.
// `2019-08-12-scaling-your-development-process-P1.md` publishes at
// `/scaling-your-development-process-P1/`, capital P1 preserved. Astro's
// default `generateId` *does* lowercase/slugify, which would silently change
// that URL (breaking both SEO and the giscus comment mapping, which keys off
// the exact pathname) — so this uses the raw filename (minus extension)
// unchanged instead.
const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    comments: z.boolean().default(true),
    published: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
  }),
});

export const collections = { posts };
