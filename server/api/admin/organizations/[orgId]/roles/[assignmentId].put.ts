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
    const assignmentIdParam = getRouterParam(event, 'assignmentId');
    if (!orgIdParam || !assignmentIdParam) {
        throw createError({
            statusCode: 400,
            message: 'Organization ID and Assignment ID required',
        });
    }
    const orgId = parseInt(orgIdParam, 10);
    const assignmentId = parseInt(assignmentIdParam, 10);
    if (isNaN(orgId) || isNaN(assignmentId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid Organization ID or Assignment ID',
        });
    }

    const body = await readBody(event);
    const { roleId } = body;
    if (!roleId) {
        throw createError({ statusCode: 400, message: 'roleId required' });
    }

    const prisma = event.context.prisma;

    try {
        // Verify assignment exists and belongs to org
        const existing = await prisma.userRoleInOrganization.findUnique({
            where: { id: assignmentId },
        });
        if (!existing || existing.organizationId !== orgId) {
            throw createError({
                statusCode: 404,
                message: 'Assignment not found',
            });
        }

        // Verify new role exists
        const roleExists = await prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!roleExists) {
            throw createError({ statusCode: 400, message: 'Invalid role' });
        }

        // Check if new assignment would conflict
        const conflict = await prisma.userRoleInOrganization.findUnique({
            where: {
                userId_roleId_organizationId: {
                    userId: existing.userId,
                    roleId,
                    organizationId: orgId,
                },
            },
        });
        if (conflict && conflict.id !== assignmentId) {
            throw createError({
                statusCode: 409,
                message: 'Role assignment already exists',
            });
        }

        const assignment = await prisma.userRoleInOrganization.update({
            where: { id: assignmentId },
            data: { roleId },
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
        console.error('Error updating role assignment:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update role assignment',
        });
    }
});
