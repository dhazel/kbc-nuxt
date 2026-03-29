// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },

    modules: [
      '@primevue/nuxt-module',
      '@nuxt/icon',
      '@nuxt/fonts',
      '@nuxtjs/kinde',
      '@nuxtjs/color-mode',
      '@pinia/nuxt',
      '@nuxt/image'
    ],

    nitro: {
        preset: 'netlify',
    },

    vite: {
        plugins: [tailwindcss()],
    },

    kinde: {
        middleware: true,
    },

    primevue: {
        options: {
            theme: {
                preset: Aura,
            },
            ripple: true,
            unstyled: false,
        },
    },

    css: ['primeicons/primeicons.css', '~/assets/css/main.css'],

    plugins: [
        { src: '~/plugins/kv.client.ts', mode: 'client' },
        { src: '~/plugins/sppService.client.ts', mode: 'client' },
        { src: '~/plugins/userService.client.ts', mode: 'client' },
    ],

    runtimeConfig: {
        kvBackend: 'netlify',
        mondayToken: process.env.NUXT_MONDAY_TOKEN || 'default_token',
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            name: process.env.DB_NAME,
        },
        public: {
            NUXT_SPPSERVICE_TYPE:
                process.env.NUXT_SPPSERVICE_TYPE || 'indexeddb',
        },
    },

    routeRules: {
        '/reports/intercessors': {
            appMiddleware: ['auth-logged-in'],
            kinde: {
                // permissions: { admin: true }, // This fails for some reason
                redirectUrl: '/',
                external: true,
            },
        },
        '/demo': {
            redirect: '/',
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
});

// TypeScript declaration for injected $userService
declare module '#app' {
    interface NuxtApp {
        $userService: import('~/app/utils/UserKvService').UserKvService;
    }
}