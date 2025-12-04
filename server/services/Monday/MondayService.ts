import type { IMondayAdapter } from '../../adapters/IMondayAdapter';
import type {
    ActivityLog,
    Column,
    IMondayService,
    Item,
    User,
} from './IMondayService';
import { ResultSizeError } from '~/server/errors/ResultSizeError';

export class MondayService implements IMondayService {
    constructor(private mondayAdapter: IMondayAdapter) {}

    /**
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    public async getAllRelatedItems(
        activityLogs: ActivityLog[]
    ): Promise<Item[]> {
        const itemIds = [
            ...new Set(
                activityLogs
                    .map((log: ActivityLog) =>
                        log.data ? JSON.parse(log.data).pulse_id : null
                    )
                    .filter(Boolean)
            ),
        ];

        let items = [];
        if (itemIds.length > 0) {
            const itemsQuery = `query { items(ids: [${itemIds.join(',')}], limit: 10000) { id name board { id name } group { id title } column_values { id value } } }`;
            const itemsResponse = await this.mondayAdapter.query(itemsQuery);
            items = itemsResponse.data.items?? [];
        }
        return items;
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @param statusText - The text of the status that the activity log references
     * @returns Collection of activity logs filtered to contain only those with the given status
     */
    public filterActivityLogsByStatus(
        activityLogs: ActivityLog[],
        statusText: string
    ) {
        return activityLogs.filter((log: ActivityLog) => {
            if (log.event !== 'update_column_value') return false;
            const data = JSON.parse(log.data);
            if (data.column_id !== 'status') return false;
            const parsedValue = data.value;
            const label = parsedValue?.label.text;
            return label?.toLowerCase() === statusText.toLowerCase();
        });
    }

    /**
     * @param boards - Collection of board IDs
     * @param endDate - End of the date range
     * @param startDate - Start of the date range
     * @returns Collection of all activity logs where an item was created within the given date range
     */
    public async getAllItemCreationActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ): Promise<ActivityLog[]> {
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        const maxActivityLog = 10000;
        const activityQuery = `query { boards(ids: [${boards.join(',')}]) { name activity_logs(from: "${startDate.toISOString()}", to: "${inclusiveEndDate.toISOString()}", limit: ${maxActivityLog}) { id event data user_id created_at } } }`;
        const activityResponse = await this.mondayAdapter.query(activityQuery);
        const allActivityLogs = activityResponse.data.boards.flatMap(
            (board: { name: string; activity_logs: ActivityLog[] }) =>
                board.activity_logs.map((log) => ({
                    ...log,
                    boardName: board.name,
                }))
        );
        if (allActivityLogs.length >= maxActivityLog) {
            console.warn(
                `ActivityLog size ${allActivityLogs.length} exceeds the maximum allowed size of ${maxActivityLog} for date range: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`
            );
            throw ResultSizeError.exceedsMaxSize(
                maxActivityLog,
                allActivityLogs.length
            );
        }
        const activityLogs = allActivityLogs.filter(
            (log: ActivityLog) => log.event === 'create_pulse'
        );
        return activityLogs;
    }

    /**
     * @param boards - Collection of board IDs
     * @param endDate - End of the date range
     * @param startDate - Start of the date range
     * @returns Collection of all activity logs that had their status changed within the given date range
     */
    public async getAllStatusActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ): Promise<ActivityLog[]> {
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        const maxActivityLog = 10000;
        const activityQuery = `query { boards(ids: [${boards.join(',')}]) { name activity_logs(from: "${startDate.toISOString()}", to: "${inclusiveEndDate.toISOString()}", column_ids: ["status"], limit: ${maxActivityLog}) { id event data user_id created_at } } }`;
        const activityResponse = await this.mondayAdapter.query(activityQuery);
        const allActivityLogs = activityResponse.data.boards.flatMap(
            (board: { name: string; activity_logs: ActivityLog[] }) =>
                board.activity_logs.map((log) => ({
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

    /**
     * @param boardId - Id of a board on Monday.com
     * @returns A map of status IDs to their label text
     */
    public async getStatusLabels(
        boardId: number
    ): Promise<Record<number, string>> {
        const boardQuery = `query { boards(ids: [${boardId}]) { columns { id title type settings_str } } }`;
        const boardResponse = await this.mondayAdapter.query(boardQuery);
        const boardData = boardResponse.data.boards[0] as {
            columns: (Column & { settings_str: string })[];
        };
        const statusColumn = boardData.columns.find(
            (col: Column & { settings_str: string }) => col.type === 'status'
        );
        if (!statusColumn) throw new Error('Status column not found');
        const settings = JSON.parse(statusColumn.settings_str);
        const labels = settings.labels || {};
        const labelMap: Record<number, string> = {};
        if (Array.isArray(labels)) {
            labels.forEach((l: { id: number; name: string }) => {
                labelMap[l.id] = l.name;
            });
        } else if (typeof labels === 'object') {
            Object.entries(labels).forEach(([key, value]) => {
                labelMap[parseInt(key)] = value as string;
            });
        }
        return labelMap;
    }

    public async getAllMondayUsers(): Promise<Record<string, string>> {
        const usersQuery = `query { users { id name } }`;
        const usersResponse = await this.mondayAdapter.query(usersQuery);
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

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    public async getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string }[]>> {
        const query = `query { boards(ids: [${boardIds.join(',')}], limit: 1000) { id groups { id title } } }`;
        const response = await this.mondayAdapter.query(query);
        const boards = response.data.boards;
        const result: Record<number, { id: string; title: string }[]> = {};
        boards.forEach(
            (board: {
                id: string;
                groups: { id: string; title: string }[];
            }) => {
                result[parseInt(board.id)] = board.groups;
            }
        );
        return result;
    }
}
