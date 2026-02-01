export default defineNuxtRouteMiddleware(async (_to, _from) => {
    const { $auth, $userService } = useNuxtApp();

    // Check if user is logged in
    if (!$auth?.loggedIn) {
        return navigateTo('/api/login');
    }

    // Fetch user profile and check for admin role
    try {
        const profile = await $userService.getUserProfileByEmail(
            $auth.user.email
        );
        if (!profile || !profile.roles.includes('admin')) {
            return navigateTo('/');
        }
    } catch (error) {
        // If profile fetch fails, deny access
        console.error(
            'Failed to fetch user profile in admin middleware:',
            error
        );
        return navigateTo('/');
    }
});
