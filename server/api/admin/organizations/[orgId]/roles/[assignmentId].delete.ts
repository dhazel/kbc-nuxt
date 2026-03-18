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

        await prisma.userRoleInOrganization.delete({
            where: { id: assignmentId },
        });
        return { success: true };
    } catch (error) {
        if ((error as { statusCode?: number }).statusCode) throw error;
        console.error('Error deleting role assignment:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete role assignment',
        });
    }
});
