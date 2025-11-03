import mondaySdk from 'monday-sdk-js';
import type { IAdminService, PrayerOrderData } from './IAdminService';

interface Column {
    id: string;
    title: string;
    type: string;
    settings_str?: string;
}

interface User {
    id: string;
    name: string;
}

interface ActivityLog {
    id: string;
    event: string;
    data: string;
    user_id: string;
    created_at: string;
}

interface ColumnValue {
    id: string;
    value: string;
}

interface Item {
    id: string;
    name: string;
    column_values: ColumnValue[];
}

interface ItemsResponse {
    items: Item[];
}

export class AdminService implements IAdminService {
    async getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            // set up the monday sdk
            const config = useRuntimeConfig();
            const monday = mondaySdk();
            monday.setToken(config.mondayToken);

            // define the set of boards that we will operate on
            const boards = [8281675180];

            // query the monday api to get the status column ID and settings
            const boardQuery = `query { boards(ids: [${boards[0]}]) { columns { id title type settings_str } } }`;
            const boardResponse = await monday.api(boardQuery);
            const boardData = boardResponse.data.boards[0] as {
                columns: (Column & { settings_str: string })[];
            };
            const statusColumn = boardData.columns.find(
                (col: Column & { settings_str: string }) =>
                    col.type === 'status'
            );
            if (!statusColumn) throw new Error('Status column not found');
            const statusColumnId = statusColumn.id;
            const settings = JSON.parse(statusColumn.settings_str);
            const labels = settings.labels || {};
            const labelMap: Record<number, string> = {};
            if (Array.isArray(labels)) {
                labels.forEach((l: any) => {
                    labelMap[l.id] = l.name;
                });
            } else if (typeof labels === 'object') {
                Object.entries(labels).forEach(([key, value]) => {
                    labelMap[parseInt(key)] = value as string;
                });
            }

            // query the monday api to get all the users that are active on the given set of boards
            const usersQuery = `query { boards(ids: [${boards[0]}]) { subscribers { id name } } }`;
            const usersResponse = await monday.api(usersQuery);
            const usersData = usersResponse.data.boards[0] as {
                subscribers: User[];
            };
            const activeUsers: Record<string, string> =
                usersData.subscribers.reduce(
                    (map: Record<string, string>, user: User) => {
                        map[user.id] = user.name;
                        return map;
                    },
                    {}
                );

            // query the monday api to get all the items, on the given set of boards, that had their status column changed between the start and the end date
            const inclusiveEndDate = new Date(endDate);
            inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
            const activityQuery = `query { boards(ids: [${boards[0]}]) { activity_logs(from: "${startDate.toISOString()}", to: "${inclusiveEndDate.toISOString()}", column_ids: ["${statusColumnId}"]) { id event data user_id created_at } } }`;
            const activityResponse = await monday.api(activityQuery);
            const activityData = activityResponse.data.boards[0] as {
                activity_logs: ActivityLog[];
            };
            const activityLogs = activityData.activity_logs;

            // filter the set of returned items to only those items whose status changed to "Closed"
            const closedChanges = activityLogs.filter((log: ActivityLog) => {
                if (log.event !== 'update_column_value') return false;
                const data = JSON.parse(log.data);
                if (data.column_id !== statusColumnId) return false;
                const parsedValue = data.value;
                const index = parsedValue?.label.index;
                const label = labelMap[index];
                return label === 'Closed';
            });

            if (closedChanges.length === 0) return [];

            const itemIds = [
                ...new Set(
                    closedChanges
                        .map((log: ActivityLog) =>
                            log.data ? JSON.parse(log.data).pulse_id : null
                        )
                        .filter(Boolean)
                ),
            ];

            // query the monday api, for only those items who had their status changed to "Closed", and return only those items whose status is currently "Closed"
            const itemsQuery = `query { items(ids: [${itemIds.join(',')}]) { id name column_values { id value } } }`;
            const itemsResponse = await monday.api(itemsQuery);
            const itemsData = itemsResponse.data as ItemsResponse;
            const items = itemsData.items.filter((item: Item) => {
                const statusValue = item.column_values.find(
                    (cv: ColumnValue) => cv.id === statusColumnId
                );
                if (!statusValue) return false;
                const parsedValue = JSON.parse(statusValue.value);
                const index = parsedValue?.index;
                const label = labelMap[index];
                return label === 'Closed';
            });

            // build PrayerOrderData objects by combining the active users with the closed items
            const prayerOrders: PrayerOrderData[] = [];
            for (const item of items) {
                const changeLog = closedChanges.find(
                    (log: ActivityLog) =>
                        JSON.parse(log.data).pulse_id == item.id
                );
                if (changeLog) {
                    const unixMs = Math.round(
                        parseInt(changeLog.created_at) / 10000
                    );
                    prayerOrders.push({
                        status: 'Closed',
                        closeDate: new Date(unixMs),
                        title: item.name,
                        intercessor:
                            activeUsers[changeLog.user_id] || 'Unknown',
                    });
                }
            }

            // return the PrayerOrderData objects
            return prayerOrders;
        } catch (error) {
            console.error('Error in getClosedPrayerOrders:', error);
            throw error;
        }
    }
}
