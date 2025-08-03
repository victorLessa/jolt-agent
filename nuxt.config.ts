// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  ssr: true,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/scripts',
    'shadcn-nuxt'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui'
  }
})