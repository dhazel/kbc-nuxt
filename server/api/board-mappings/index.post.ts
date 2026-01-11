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

    const body = await readBody(event);
    const { subscriptionId, threadTypeId, mondayBoardId } = body;

    if (!subscriptionId || !threadTypeId) {
        throw createError({
            statusCode: 400,
            message: 'subscriptionId and threadTypeId are required',
        });
    }
    if (
        typeof subscriptionId !== 'number' ||
        typeof threadTypeId !== 'number' ||
        (mondayBoardId !== undefined && typeof mondayBoardId !== 'number')
    ) {
        throw createError({ statusCode: 400, message: 'IDs must be numbers' });
    }

    try {
        return await event.context.boardMappingService.createBoardMapping({
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
        console.error('Error creating board mapping:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
