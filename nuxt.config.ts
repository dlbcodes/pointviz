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
  modules: [],
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
})