import type { UserService } from '~/utilities/UserService'

declare module '#auth' {
  interface User {
    // Kinde default properties
    name?: string
    email?: string
    picture?: string

    // Enhanced properties from KV store
    profile: {
      prayerOrders: number
      prayerResponses: number
      joinedAt: string
      visitCount: number
      preferences: Record<string, any>
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: {
      loggedIn: boolean
      user: import('#auth').User
    }
  }
}

declare module '#app' {
  interface NuxtApp {
    $userService: UserService
  }
}