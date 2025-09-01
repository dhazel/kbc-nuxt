export default defineNuxtPlugin(async () => {
  const { $auth, $userService } = useNuxtApp()

  // Function to enhance user object with profile data
  const enhanceUserProfile = async (user: any) => {
    try {
      const profile = await $userService.getOrCreateCurrentUserProfile()
      if (profile) {
        profile.visitCount += 1;
        await $userService.saveCurrentUserProfile(profile);
        const enhancedUser = { ...user, profile: profile }
        return enhancedUser
      }
      return user
    } catch (error) {
      console.error('Failed to enhance user profile:', error)
      // Return original user object if enhancement fails
      return user
    }
  }

  // Watch for authentication state changes
  watch(() => $auth.loggedIn, async (isLoggedIn) => {
    if (isLoggedIn && $auth.user) {
      $auth.user = await enhanceUserProfile($auth.user)
    }
  })

  // Also enhance user on initial load if already authenticated
  if ($auth.loggedIn && $auth.user) {
    $auth.user = await enhanceUserProfile($auth.user)
  }
})
