// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.5error.com",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Matches the site's previous hand-rolled Rouge "Atom One Dark" code
      // block palette closely — same theme family, built into Shiki.
      theme: "one-dark-pro",
    },
  },
});
