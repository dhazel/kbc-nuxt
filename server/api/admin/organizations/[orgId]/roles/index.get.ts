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

    const orgIdParam = getRouterParam(event, 'orgId');
    if (!orgIdParam) {
        throw createError({
            statusCode: 400,
            message: 'Organization ID required',
        });
    }
    const orgId = parseInt(orgIdParam, 10);
    if (isNaN(orgId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid Organization ID',
        });
    }

    const prisma = event.context.prisma;

    try {
        const assignments = await prisma.userRoleInOrganization.findMany({
            where: { organizationId: orgId },
            include: {
                user: {
                    select: { id: true, email: true, name: true },
                },
                role: {
                    select: { id: true, name: true },
                },
            },
        });
        return assignments;
    } catch (error) {
        console.error('Error fetching organization roles:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch organization roles',
        });
    }
});
