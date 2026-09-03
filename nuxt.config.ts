// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // nuxt.config.ts — add to defineNuxtConfig({ ... })
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    customizeModel: process.env.CUSTOMIZE_MODEL || "claude-haiku-4-5", // cheap; bump to sonnet if fuzzy asks underperform
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@pinia/nuxt', '@vercel/analytics'],
  css: ['~/assets/styles/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@dlbcodes/ui',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@phosphor-icons/vue',
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ["/account(/*)?"],
    },
  },
  routeRules: {
    "/embed/**": {
      headers: {
        "X-Frame-Options": "", // clear any deny
        "Content-Security-Policy": "frame-ancestors *;", // allow embedding anywhere
      },
    },
  },
  nitro: {
    preset: "vercel", esbuild: {
      options: { target: 'es2022' },
    },
  },
  app: {
    head: {
      titleTemplate: "%s · PointViz",
      title: "PointViz",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Turn any Figma design into a template your AI rebuilds directly in your stack. Paste a link, connect to Claude, remix.",
        },
        { property: "og:site_name", content: "PointViz" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", href: "/favicon.ico" },
      ],
    },
  },
})