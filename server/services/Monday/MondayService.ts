import type { IMondayAdapter } from '../../adapters/IMondayAdapter';
import type {
    ActivityLog,
    Board,
    Column,
    IMondayService,
    Item,
    ItemUpdate,
    User,
} from './IMondayService';
import { ResultSizeError } from '../../errors/ResultSizeError';

export class MondayService implements IMondayService {
    constructor(private mondayAdapter: IMondayAdapter) {}

    /**
     * @param startDate - Start of the date range
     * @param endDate - End of the date range
     * @returns Collection of all Item messages, called "Updates" within Monday,
     *  that happened within the given date range
     */
    public async getAllItemMessages(
        startDate: Date,
        endDate: Date
    ): Promise<ItemUpdate[]> {
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        const allUpdates: ItemUpdate[] = [];
        let page = 1;

        while (true) {
            const query = `
                query GetBoardUpdatesInPeriod {
                  updates(
                    limit: 100
                    page: ${page}
                    from_date: "${startDate.toISOString()}"
                    to_date: "${inclusiveEndDate.toISOString()}"
                  ) {
                    id
                    body
                    text_body
                    created_at
                    edited_at
                    creator {
                      id
                      name
                    }
                    item_id
                    item {
                      id
                      name
                      board {
                        id
                        name
                      }
                    }
                    viewers {
                      user_id
                    }
                    likes {
                      creator_id
                      reaction_type
                    }
                  }
                }
            `;
            const response = await this.mondayAdapter.query(query);
            const updates = response.data.updates;

            if (!updates || updates.length === 0) {
                break;
            }

            const mappedUpdates = updates.map(
                (update: Record<string, unknown>) => ({
                    ...update,
                    bodyText: update.text_body,
                    viewers: update.viewers.map((v) => ({
                        userMondayId: v.user_id,
                    })),
                    reactions: update.likes.map((l) => ({
                        userMondayId: l.creator_id,
                        reactionType: l.reaction_type
                    })),
                })
            );

            allUpdates.push(...mappedUpdates);
            page++;
        }

        return allUpdates;
    }

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

        return await this.getItemsById(itemIds);
    }

    /*
     * @param itemIds - Collection of monday IDs corresponding to the desired Items
     * @returns Collection of all the items referenced by the given monday IDs
     */
    public async getItemsById(itemIds: number[]): Promise<Item[]> {
        if (itemIds.length === 0) return [];

        const chunkSize = 100;
        const chunks = itemIds.reduce((acc, id, i) => {
            if (i % chunkSize === 0) acc.push([]);
            acc[acc.length - 1].push(id);
            return acc;
        }, [] as number[][]);

        const queryTemplate = (ids: number[]) =>
            `query {
                items(
                    ids: [${ids.join(',')}],
                    limit: 10000
                ) {
                    id
                    name
                    board {
                        id name
                    }
                    group {
                        id title
                    }
                    column_values {
                        id value
                    }
                }
            }`;

        const promises = chunks.map((chunk: number[]) =>
            this.mondayAdapter.query(queryTemplate(chunk))
        );

        const responses = await Promise.all(promises);
        return responses.flatMap((res) => res.data.items ?? []);
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @param statusText - The text of the status that the activity log references
     * @returns Collection of activity logs filtered to contain only those with the given status
     */
    public filterActivityLogsByStatus(
        activityLogs: ActivityLog[],
        statusText: string[]
    ) {
        return activityLogs.filter((log: ActivityLog) => {
            if (log.event !== 'update_column_value') return false;
            const data = JSON.parse(log.data);
            if (data.column_id !== 'status') return false;
            const parsedValue = data.value;
            const label = parsedValue?.label.text;
            return statusText.some(
                (text) => label?.toLowerCase() === text.toLowerCase()
            );
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
        const activityQuery = `query {
            boards(
                ids: [${boards.join(',')}]
            ) {
                id
                name
                activity_logs(
                    from: "${startDate.toISOString()}",
                    to: "${inclusiveEndDate.toISOString()}",
                    limit: ${maxActivityLog}
                ) {
                    id event data user_id created_at
                }
            }
        }`;
        const activityResponse = await this.mondayAdapter.query(activityQuery);
        const allActivityLogs = activityResponse.data.boards.flatMap(
            (board: {
                id: number;
                name: string;
                activity_logs: ActivityLog[];
            }) =>
                board.activity_logs.map((log) => ({
                    ...log,
                    boardName: board.name,
                    boardId: board.id,
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
        const activityQuery = `query {
            boards(
                ids: [${boards.join(',')}]
            ) {
                id
                name
                activity_logs(
                    from: "${startDate.toISOString()}",
                    to: "${inclusiveEndDate.toISOString()}",
                    column_ids: ["status"],
                    limit: ${maxActivityLog}
                ) {
                    id
                    event
                    data
                    user_id
                    created_at
                }
            }
        }`;
        const activityResponse = await this.mondayAdapter.query(activityQuery);
        const allActivityLogs = activityResponse.data.boards.flatMap(
            (board: {
                id: number;
                name: string;
                activity_logs: ActivityLog[];
            }) =>
                board.activity_logs.map((log) => ({
                    ...log,
                    boardName: board.name,
                    boardId: board.id,
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
        boardIds: number[]
    ): Promise<Record<string, Record<number, string>>> {
        const boardQuery = `query {
            boards(
                ids: [${boardIds.join(',')}]
            ) {
                id
                columns {
                    id
                    title
                    type
                    settings_str
                }
            }
        }`;
        const boardResponse = await this.mondayAdapter.query(boardQuery);
        const labelMap: Record<string, Record<number, string>> = {};
        for (const boardData of boardResponse.data.boards as {
            id: string;
            columns: (Column & { settings_str: string })[];
        }[]) {
            const statusColumn = boardData.columns.find(
                (col: Column & { settings_str: string }) =>
                    col.type === 'status'
            );
            if (!statusColumn) {
                console.warn(
                    `Status column not found for board ${boardData.id}`
                );
                continue;
            }
            const settings = JSON.parse(statusColumn.settings_str);
            const labels = settings.labels || {};
            const boardLabelMap: Record<number, string> = {};
            if (Array.isArray(labels)) {
                labels.forEach((l: { id: number; name: string }) => {
                    boardLabelMap[l.id] = l.name;
                });
            } else if (typeof labels === 'object') {
                Object.entries(labels).forEach(([key, value]) => {
                    boardLabelMap[parseInt(key)] = value as string;
                });
            }
            labelMap[boardData.id] = boardLabelMap;
        }
        return labelMap;
    }

    public async getAllMondayUsers(): Promise<User[]> {
        const usersQuery = `query { users { id name email } }`;
        const usersResponse = await this.mondayAdapter.query(usersQuery);
        const allUsers = usersResponse.data.users.map(
            (user: { id: string; name: string; email?: string }) => ({
                ...user,
                mondayId: user.id,
            })
        ) as User[];
        return allUsers;
    }

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    public async getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string }[]>> {
        const query = `query {
            boards(
                ids: [${boardIds.join(',')}],
                limit: 1000
            ) {
                id
                groups {
                    id
                    title
                }
            }
        }`;
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

    /**
     * @param boardIds - Collection of board IDs
     * @returns Array of Board objects with mondayId and name
     */
    public async getBoards(boardIds: number[]): Promise<Board[]> {
        const query = `query {
            boards(
                ids: [${boardIds.join(',')}]
            ) {
                id
                name
            }
        }`;
        const response = await this.mondayAdapter.query(query);
        const boards = response.data.boards;
        return boards.map((board: { id: string; name: string }) => ({
            mondayId: parseInt(board.id),
            name: board.name,
        }));
    }
}
