export interface Column {
    id: string;
    title: string;
    type: string;
    settings_str?: string;
}

export interface User {
    id: string;
    name: string;
}

export interface ActivityLog {
    id: string;
    event: string;
    data: string;
    user_id: string;
    created_at: string;
    boardName?: string;
}

export interface ColumnValue {
    id: string;
    value: string;
}

export interface Item {
    id: string;
    name: string;
    column_values: ColumnValue[];
    group?: { id: string; title: string };
}

export interface ItemsResponse {
    items: Item[];
}

export interface IMondayService {
    /*
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    getAllRelatedItems(activityLogs: ActivityLog[]): Promise<ItemsResponse>;

    /**
     * @param activityLogs - Collection of activity logs
     * @param statusText - The text of the status that the activity log references
     * @returns Collection of activity logs filtered to contain only those with the given status
     */
    filterActivityLogsByStatus(activityLogs: ActivityLog[], statusText: string): ActivityLog[];

    /**
     * @param boards - Collection of board IDs
     * @param endDate - End of the date range
     * @param startDate - Start of the date range
     * @returns Collection of all activity logs that had their status changed within the given date range
     */
    getAllStatusActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ): Promise<ActivityLog[]>;

    /**
     * @param boardId - Id of a board on Monday.com
     * @returns A map of status IDs to their label text
     */
    getStatusLabels(boardId: number): Promise<Record<number, string>>;

    getAllMondayUsers(): Promise<Record<string, string>>;

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string }[]>>;
}
