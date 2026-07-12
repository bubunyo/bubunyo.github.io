import { getCollection, type CollectionEntry } from "astro:content";

const FILENAME_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

/**
 * Post ids are the filename minus extension, e.g. `2019-05-04-go-style-...`.
 * Jekyll derived both the date and the `:title` permalink slug from this same
 * filename convention — this splits it back into the two parts.
 */
export function parsePostId(id: string): { date: Date; slug: string } {
  const match = id.match(FILENAME_DATE_RE);
  if (!match) {
    return { date: new Date(0), slug: id };
  }
  const [, year, month, day, slug] = match;
  return { date: new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))), slug };
}

export type Post = CollectionEntry<"posts"> & {
  date: Date;
  slug: string;
};

function toPost(entry: CollectionEntry<"posts">): Post {
  const { date, slug } = parsePostId(entry.id);
  return { ...entry, date, slug };
}

/** All published posts, newest first — mirrors Jekyll's `site.posts`. */
export async function getPublishedPosts(): Promise<Post[]> {
  const entries = await getCollection("posts", ({ data }) => data.published !== false);
  return entries.map(toPost).sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Approximate reading time from the raw markdown body, ~200 words/min. */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.floor(words / 200) + 1;
}
