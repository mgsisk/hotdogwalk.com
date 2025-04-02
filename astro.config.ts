import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://hotdogwalk.com",
  build: { assets: "srv" },
  experimental: { responsiveImages: true, svg: true },
  image: { experimentalLayout: "responsive" },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.match(/\/(info|orders|success)\//) }),
  ],
});
