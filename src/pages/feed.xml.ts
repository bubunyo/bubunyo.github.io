import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../consts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.titleLeft}${SITE.titleRight}`,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.date,
      link: `/${post.slug}/`,
      content: post.rendered?.html,
      categories: post.data.tags,
    })),
  });
}
