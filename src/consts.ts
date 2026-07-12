// Site-wide constants — the Astro equivalent of Jekyll's `_config.yml`.

export const SITE = {
  titleLeft: "5",
  titleRight: " Error",
  description: "Software, stories, and the world they're built in.",
  keywords: "thoughts, stories, ideas, software, ghana, afradio, culture, thinkspace",
  twitterUsername: "KiddBubu",
  commentsEnabled: true,
  postShareEnabled: true,
  authorName: "Bubunyo Nyavor",
} as const;

export const GISCUS = {
  repo: "bubunyo/bubunyo.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkxNzgyNTU1Njg",
  category: "General",
  categoryId: "DIC_kwDOCp_20M4C3ahA",
  theme: "light",
  lang: "en",
} as const;

export const SOCIAL_LINKS = [
  { label: "x.com/KiddBubu", href: "https://x.com/KiddBubu" },
  { label: "github.com/bubunyo", href: "https://github.com/bubunyo" },
  { label: "linkedin.com/in/bubunyonyavor", href: "https://www.linkedin.com/in/bubunyonyavor/" },
] as const;
