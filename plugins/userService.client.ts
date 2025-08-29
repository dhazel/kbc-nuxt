import { UserService } from '~/utilities/UserService'

export default defineNuxtPlugin((): object => {
  const { $clientKv, $auth } = useNuxtApp()

  // Initialize UserService with the KV store
  const userService: UserService = new UserService($clientKv)

  // Set current user if already authenticated
  if ($auth.loggedIn && $auth.user) {
    userService.setCurrentUser($auth.user)
  }

  // Watch for authentication state changes
  watch(() => $auth.loggedIn, (isLoggedIn) => {
    if (isLoggedIn && $auth.user) {
      userService.setCurrentUser($auth.user)
    } else {
      userService.clearCurrentUser()
    }
  })

  // Provide the UserService to the Nuxt app
  return {
    provide: {
      userService
    }
  }
})