import type {
    IIntercessorReportService,
    PrayerOrderData,
} from './IIntercessorReportService';
import type { IMondayService } from '../IMondayService';
import { ResultSizeError } from '~/server/errors/ResultSizeError';

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
    boardName?: string;
}

interface ColumnValue {
    id: string;
    value: string;
}

interface Item {
    id: string;
    name: string;
    column_values: ColumnValue[];
    group?: { id: string; title: string };
}

interface ItemsResponse {
    items: Item[];
}

interface Group {
    id: string;
    title: string;
}

interface BoardWithGroups {
    id: string;
    name: string;
    groups: Group[];
}

export class SppInformedReportService implements IIntercessorReportService {
    constructor(private mondayService: IMondayService) {}

    async getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            const boardIds = [
                18130780948, 9731839830, 9675066534, 9913642037, 9804560302,
                18080835095,
            ];

            let prayerOrders: PrayerOrderData[] = [];

            const activityLogs = await this.getAllStatusActivityLogs(boardIds, startDate, endDate);

            const closedActivityLogs = this.getClosedActivityLogs(activityLogs);

            if (closedActivityLogs.length !== 0) {
                const closedItems = await this.getAllRelatedItems(closedActivityLogs);

                prayerOrders = this.makePrayerOrderList(
                    closedActivityLogs,
                    closedItems,
                    await this.getStatusLabels(boardIds),
                    await this.getAllMondayUsers()
                );
            }

            return prayerOrders;
        } catch (error) {
            console.error('Error in getClosedPrayerOrders:', error);
            throw error;
        }
    }

    private makePrayerOrderList(
        closedChanges: any,
        items: ItemsResponse,
        labelMap: Record<number, string>,
        allUsersMap: Record<string, string>
    ) {
        const prayerOrders: PrayerOrderData[] = [];
        for (const changeLog of closedChanges) {
            const unixMs = Math.round(
                parseInt(changeLog.created_at) / 10000
            );
            const changeLogData = JSON.parse(changeLog.data);
            let item = items.items.filter(
                (item: Item) => changeLogData.pulse_id == item.id
            )[0];
            let status = 'Unknown';
            if (item) {
                const statusColumnValue = item.column_values.find(
                    (cv) => cv.id === 'status'
                );
                if (statusColumnValue) {
                    try {
                        const parsedValue = JSON.parse(
                            statusColumnValue.value
                        );
                        const index = parsedValue?.index;
                        status = labelMap[index] || 'Unknown';
                    } catch {
                        status = 'Unknown';
                    }
                }
            } else {
                status = 'Deleted';
                item = {
                    id: 'none',
                    name: changeLogData.pulse_name,
                    column_values: [],
                    group: { id: 'none', title: 'Unknown' },
                };
            }
            prayerOrders.push({
                status: status,
                closeDate: new Date(unixMs),
                title: item.name,
                board: changeLog.boardName || 'Unknown',
                intercessor: allUsersMap[changeLog.user_id] || 'Unknown',
                group: item.group?.title || 'Unknown',
            });
        }
        return prayerOrders;
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    private async getAllRelatedItems(activityLogs: ActivityLog[]): Promise<ItemsResponse> {
        const itemIds = [
            ...new Set(
                activityLogs
                    .map((log: ActivityLog) => log.data ? JSON.parse(log.data).pulse_id : null
                    )
                    .filter(Boolean)
            ),
        ];

        const itemsQuery = `query { items(ids: [${itemIds.join(',')}], limit: 10000) { id name group { id title } column_values { id value } } }`;
        const itemsResponse = await this.mondayService.query(itemsQuery);
        const items = itemsResponse.data as ItemsResponse;
        return items;
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @returns Collection of activity logs filtered to contain only those with a 'closed' status
     */
    private getClosedActivityLogs(activityLogs: ActivityLog[]) {
        return activityLogs.filter((log: ActivityLog) => {
            if (log.event !== 'update_column_value') return false;
            const data = JSON.parse(log.data);
            if (data.column_id !== 'status') return false;
            const parsedValue = data.value;
            const label = parsedValue?.label.text;
            return label?.toLowerCase() === 'closed';
        });
    }

    /**
     * @param boards - Collection of board IDs
     * @param endDate - End of the date range
     * @param startDate - Start of the date range
     * @returns Collection of all activity logs that had their status changed within the given date range
     */
    private async getAllStatusActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ) {
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        const maxActivityLog = 10000;
        const activityQuery = `query { boards(ids: [${boards.join(',')}]) { name activity_logs(from: "${startDate.toISOString()}", to: "${inclusiveEndDate.toISOString()}", column_ids: ["status"], limit: ${maxActivityLog}) { id event data user_id created_at } } }`;
        const activityResponse = await this.mondayService.query(activityQuery);
        const allActivityLogs = activityResponse.data.boards.flatMap(
            (board: { name: string; activity_logs: ActivityLog[]; }) => board.activity_logs.map((log) => ({
                ...log,
                boardName: board.name,
            }))
        );
        const activityLogs = allActivityLogs;
        if (activityLogs.length >= maxActivityLog) {
            console.warn(
                `ActivityLog size ${activityLogs.length} exceeds the maximum allowed size of ${maxActivityLog} for date range: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`
            );
            throw ResultSizeError.exceedsMaxSize(
                maxActivityLog,
                activityLogs.length
            );
        }
        return activityLogs;
    }

    private async getStatusLabels(boards: number[]) {
        const boardQuery = `query { boards(ids: [${boards.join(',')}]) { columns { id title type settings_str } } }`;
        const boardResponse = await this.mondayService.query(boardQuery);
        const boardData = boardResponse.data.boards[0] as {
            columns: (Column & { settings_str: string; })[];
        };
        const statusColumn = boardData.columns.find(
            (col: Column & { settings_str: string; }) => col.type === 'status'
        );
        if (!statusColumn) throw new Error('Status column not found');
        const settings = JSON.parse(statusColumn.settings_str);
        const labels = settings.labels || {};
        const labelMap: Record<number, string> = {};
        if (Array.isArray(labels)) {
            labels.forEach((l: { id: number; name: string; }) => {
                labelMap[l.id] = l.name;
            });
        } else if (typeof labels === 'object') {
            Object.entries(labels).forEach(([key, value]) => {
                labelMap[parseInt(key)] = value as string;
            });
        }
        return labelMap;
    }

    private async getAllMondayUsers() {
        const usersQuery = `query { users { id name } }`;
        const usersResponse = await this.mondayService.query(usersQuery);
        const allUsers = usersResponse.data.users as User[];
        const allUsersMap: Record<string, string> = allUsers.reduce(
            (map: Record<string, string>, user: User) => {
                map[user.id] = user.name;
                return map;
            },
            {}
        );
        return allUsersMap;
    }
}
