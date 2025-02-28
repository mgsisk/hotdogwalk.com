import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hotdogwalk.com",
  build: { assets: "srv" },
  experimental: { svg: true },
  integrations: [sitemap({ filter: (page) => !page.match(/\/success\//) })],
});
