export default defineEventHandler(async (event) => {
    const kinde = event.context.kinde;
    if (kinde === null) {
        throw createError({
            statusCode: 500,
            message: 'Authentication is not set up',
        });
    } else if (!(await kinde.isAuthenticated())) {
        throw createError({ statusCode: 401, message: 'Not Authenticated' });
    }

    const userService = event.context.userService;
    const email = getRouterParam(event, 'email');

    if (!email) {
        throw createError({ statusCode: 400, message: 'Email is required' });
    }

    const user = await kinde.getUser();
    if (!user || user.email !== email) {
        throw createError({ statusCode: 403, message: 'Forbidden' });
    }

    if (event.node.req.method === 'GET') {
        const profile = await userService.getUserProfileByEmail(email);
        if (profile) {
            return profile;
        } else {
            throw createError({ statusCode: 404, message: 'User not found' });
        }
    } else if (event.node.req.method === 'PUT') {
        const profile = await readBody(event);
        if (profile.email !== email) {
            throw createError({ statusCode: 400, message: 'Email mismatch' });
        }
        const success = await userService.saveUserProfile(profile);
        if (success) {
            return { success: true };
        } else {
            throw createError({
                statusCode: 500,
                message: 'Failed to save profile',
            });
        }
    } else {
        throw createError({ statusCode: 405, message: 'Method not allowed' });
    }
});
