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

    const user = await kinde.getUser();
    if (!user) {
        throw createError({ statusCode: 401, message: 'User not found' });
    }
    const profile = await event.context.userService.getUserProfileByEmail(
        user.email
    );
    if (!profile || !profile.roles.includes('admin')) {
        throw createError({ statusCode: 403, message: 'Forbidden' });
    }

    const idParam = getRouterParam(event, 'id');
    if (!idParam) {
        throw createError({ statusCode: 400, message: 'ID is required' });
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        throw createError({ statusCode: 400, message: 'Invalid ID format' });
    }

    try {
        await event.context.boardMappingService.deleteBoardMapping(id);
        return { success: true };
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'BoardMapping not found'
        ) {
            throw createError({ statusCode: 404, message: error.message });
        }
        console.error('Error deleting board mapping:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
