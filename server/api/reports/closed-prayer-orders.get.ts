import { ResultSizeError } from '~/server/errors/ResultSizeError';
import { QueryError } from '~/server/errors/QueryError';

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
        const intercessorReportService = event.context.intercessorReportService;
        const orders = await intercessorReportService.getWorkedPrayerOrders(
            start,
            end
        );
        return orders;
    } catch (error) {
        if (error instanceof ResultSizeError) {
            throw createError({
                statusCode: 413,
                statusMessage: `Too many activity logs. Try a narrower date range.`,
            });
        } else if (error instanceof QueryError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Monday query error',
            });
        } else {
            console.error('Error in report endpoint:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
});
