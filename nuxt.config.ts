// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/content',
    '@logto/nuxt',
    '@nuxtjs/kinde',
  ],

  runtimeConfig: {
    logto: {
      endpoint: 'see .env',
      appId: 'see .env',
      appSecret: 'see .env',
      cookieEncryptionKey: 'see .env',
    },
  },

  logto: {
    pathnames: {
      signIn: '/sign-in',
      signOut: '/sign-out',
      callback: '/auth/callback',
    },
  },
})
