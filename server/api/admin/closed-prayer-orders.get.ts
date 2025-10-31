import { AdminService } from '~/server/services/AdminService';

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

    const { startDate, endDate } = getQuery(event);
    if (!startDate || !endDate) {
        throw createError({
            statusCode: 400,
            message: 'startDate and endDate are required',
        });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw createError({ statusCode: 400, message: 'Invalid date format' });
    }

    try {
        const adminService = new AdminService();
        const orders = await adminService.getClosedPrayerOrders(start, end);
        return orders;
    } catch (error) {
        console.error('Error in closed-prayer-orders endpoint:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
