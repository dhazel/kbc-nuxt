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

    const body = await readBody(event);
    const { userId, roleId } = body;
    if (!userId || !roleId) {
        throw createError({
            statusCode: 400,
            message: 'userId and roleId required',
        });
    }

    const prisma = event.context.prisma;

    try {
        // Check if assignment already exists
        const existing = await prisma.userRoleInOrganization.findUnique({
            where: {
                userId_roleId_organizationId: {
                    userId,
                    roleId,
                    organizationId: orgId,
                },
            },
        });
        if (existing) {
            throw createError({
                statusCode: 409,
                message: 'Role assignment already exists',
            });
        }

        // Verify user, role, org exist
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });
        const roleExists = await prisma.role.findUnique({
            where: { id: roleId },
        });
        const orgExists = await prisma.organization.findUnique({
            where: { id: orgId },
        });
        if (!userExists || !roleExists || !orgExists) {
            throw createError({
                statusCode: 400,
                message: 'Invalid user, role, or organization',
            });
        }

        const assignment = await prisma.userRoleInOrganization.create({
            data: {
                userId,
                roleId,
                organizationId: orgId,
            },
            include: {
                user: {
                    select: { id: true, email: true, name: true },
                },
                role: {
                    select: { id: true, name: true },
                },
            },
        });
        return assignment;
    } catch (error) {
        if ((error as { statusCode?: number }).statusCode) throw error;
        console.error('Error assigning role:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to assign role',
        });
    }
});
