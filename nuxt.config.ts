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
        mondayToken: process.env.NUXT_MONDAY_TOKEN || 'default_token',
        public: {
    }
},

  routeRules: {
    '/dashboard': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        external: true,
        redirectUrl: '/api/login',
        // permissions: { admin: true },  // Commented out for now
      },
    },
    '/profile': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        external: true,
        redirectUrl: '/api/login',
        // permissions: { admin: true },  // Commented out for now
      },
    },
    '/': {
      kinde: {
        public: true,
      },
    },
    // Optional: Add '/**': { ... } if you want to protect all other routes
  },
})

// TypeScript declaration for injected $spp
declare module '#app' {
  interface NuxtApp {
    $spp: InstanceType<typeof SppConnection>;
  }
}
