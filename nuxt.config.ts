// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/content',
    '@nuxtjs/kinde',
  ],

  vite: {
      plugins: [
          tailwindcss(),
      ],
  },

  primevue: {
    options: {
        theme: {
            preset: Aura
        },
        ripple: true,
        unstyled: false
    }
  },

  css: [
      'primeicons/primeicons.css',
      '~/assets/css/main.css',
  ],

  runtimeConfig: {
  },

  // routeRules: {
  //   '/**': {
  //     appMiddleware: ['auth-logged-in'],
  //     kinde: {
  //       redirectUrl: '/api/login',
  //       external: true,
  //     },
  //   },
  //   '/': {
  //     appMiddleware: ['auth-logged-in'],
  //     kinde: {
  //       public: true,
  //     },
  //   },
  //   '/profile': {
  //     appMiddleware: ['auth-logged-in'],
  //     kinde: {
  //       redirectUrl: '/api/login',
  //       external: true,
  //     },
  //   },
  //   '/dashboard': {
  //     appMiddleware: ['auth-logged-in'],
  //     kinde: {
  //       // list of permissions that are required to access the route
  //       permissions: {
  //         admin: true,
  //       },
  //       redirectUrl: '/api/login',
  //       external: true,
  //     },
  //   },
  // },
})
