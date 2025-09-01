// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';

import type { ISppService } from './utilities/ISppService';

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

  kinde: {
    // middleware: true,
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

    plugins: [
      { src: '~/plugins/kv.client.ts', mode: 'client' },
      { src: '~/plugins/sppService.client.ts', mode: 'client' },
      { src: '~/plugins/userService.client.ts', mode: 'client' },
      { src: '~/plugins/enhance-user.client.ts', mode: 'client' }
    ],

  runtimeConfig: {
    kvBackend: 'netlify',
    mondayToken: process.env.NUXT_MONDAY_TOKEN || 'default_token',
    public: {
      NUXT_USE_KV_SPPSERVICE: process.env.NUXT_USE_KV_SPPSERVICE || 'false'
    }
  },

  routeRules: {
    '/demo': {
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
  },
})

// TypeScript declaration for injected $sppService
declare module '#app' {
  interface NuxtApp {
    $sppService: ISppService;
  }
}

// TypeScript declaration for injected $kv
declare module '#app' {
  interface NuxtApp {
    $kv: import('~/utilities/ClientStorage').ClientStorage;
  }
}
