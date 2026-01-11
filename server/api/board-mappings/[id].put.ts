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

    const body = await readBody(event);
    const { subscriptionId, threadTypeId, mondayBoardId } = body;

    if (subscriptionId !== undefined && typeof subscriptionId !== 'number') {
        throw createError({
            statusCode: 400,
            message: 'subscriptionId must be a number',
        });
    }
    if (threadTypeId !== undefined && typeof threadTypeId !== 'number') {
        throw createError({
            statusCode: 400,
            message: 'threadTypeId must be a number',
        });
    }
    if (
        mondayBoardId !== undefined &&
        mondayBoardId !== null &&
        typeof mondayBoardId !== 'number'
    ) {
        throw createError({
            statusCode: 400,
            message: 'mondayBoardId must be a number or null',
        });
    }

    try {
        return await event.context.boardMappingService.updateBoardMapping(id, {
            subscriptionId,
            threadTypeId,
            mondayBoardId,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                throw createError({ statusCode: 400, message: error.message });
            }
            if (error.message.includes('Unique constraint')) {
                throw createError({
                    statusCode: 409,
                    message: 'BoardMapping already exists',
                });
            }
        }
        console.error('Error updating board mapping:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
