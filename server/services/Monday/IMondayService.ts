import { User } from "./Models/User";
import { ActivityLog } from "./Models/ActivityLog";
import { Board } from "./Models/Board";
import { Item } from "./Models/Item";
import { ItemUpdate } from "./Models/ItemUpdate";

export interface IMondayService {
    /*
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    getAllRelatedItems(activityLogs: ActivityLog[]): Promise<Item[]>;

    /*
     * @param itemIds - Collection of monday IDs corresponding to the desired Items
     * @returns Collection of all the items referenced by the given monday IDs
     */
    getItemsById(itemIds: number[]): Promise<Item[]>;

    /**
     * @param activityLogs - Collection of activity logs
     * @param statusText - Array of status texts that the activity log references
     * @returns Collection of activity logs filtered to contain only those with the given status
     */
    filterActivityLogsByStatus(
        activityLogs: ActivityLog[],
        statusText: string[]
    ): ActivityLog[];

    /**
     * @param boards - Collection of board IDs
     * @param endDate - End of the date range
     * @param startDate - Start of the date range
     * @returns Collection of all activity logs where an item was created within the given date range
     */
    getAllItemCreationActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ): Promise<ActivityLog[]>;

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
     * @param startDate - Start of the date range
     * @param endDate - End of the date range
     * @returns Collection of all Item messages, called "Updates" within Monday,
     *  that happened within the given date range
     */
    getAllItemMessages(startDate: Date, endDate: Date): Promise<ItemUpdate[]>;

    /**
     * @param boardId - Id of a board on Monday.com
     * @returns A map of status IDs to their label text
     */
    getStatusLabels(
        boardIds: number[]
    ): Promise<Record<string, Record<number, string>>>;

    getAllMondayUsers(): Promise<User[]>;

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string }[]>>;

    /**
     * @param boardIds - Collection of board IDs
     * @returns Array of Board objects with mondayId and name
     */
    getBoards(boardIds: number[]): Promise<Board[]>;
}
