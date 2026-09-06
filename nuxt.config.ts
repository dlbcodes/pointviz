// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    customizeModel: process.env.CUSTOMIZE_MODEL || "claude-haiku-4-5",
  },
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxtjs/supabase', '@pinia/nuxt', '@vercel/analytics', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  css: ['~/assets/styles/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@dlbcodes/ui',
        '@phosphor-icons/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'echarts',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'lz-string',
        'vue-echarts',
        'zod',
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ["/account(/*)?", "/charts(/*)?"],
    },
  },
  nitro: {
    preset: "vercel",
    esbuild: {
      options: { target: "es2022" },
    },
    routeRules: {
      "/embed/**": {
        headers: {
          "Content-Security-Policy": "frame-ancestors *;",
        },
      },
    },
  },
  site: {
    url: 'https://www.pointviz.co',
  },
  sitemap: {
    exclude: ['/charts/**', '/account', '/login', '/signup', '/confirm', '/recover', '/embed/**'],
  },
  robots: {
    // allow everything by default, disallow private/app routes
    disallow: ["/charts", "/account", "/login", "/signup", "/confirm", "/recover", "/embed"],
    allow: "/",
    sitemap: "https://www.pointviz.co/sitemap.xml",
  },
  app: {
    head: {
      titleTemplate: "%s · PointViz",
      title: "PointViz — Charts you describe, not draw",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Build beautiful charts by describing them in plain English. Paste your data, tell the AI what you want, and share or embed instantly. No spreadsheets, no config." },

        // Open Graph
        { property: "og:site_name", content: "PointViz" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "PointViz — Charts you describe, not draw" },
        { property: "og:description", content: "Build beautiful charts by describing them in plain English. Paste your data, tell the AI what you want, and share or embed instantly." },
        { property: "og:image", content: "https://www.pointviz.co/og-image.png" },
        { property: "og:url", content: "https://www.pointviz.co" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "PointViz — Charts you describe, not draw" },
        { name: "twitter:description", content: "Build charts by describing them in plain English. No spreadsheets, no config." },
        { name: "twitter:image", content: "https://www.pointviz.co/og-image.png" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://www.pointviz.co" },
      ],
    },
  },
})