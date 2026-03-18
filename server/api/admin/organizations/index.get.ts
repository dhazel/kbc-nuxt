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

    const prisma = event.context.prisma;

    try {
        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        return organizations;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch organizations',
        });
    }
});
