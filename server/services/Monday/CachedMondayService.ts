import { User } from './Models/User';
import type { IMondayService } from './IMondayService';
import { ActivityLog } from './Models/ActivityLog';
import { Board } from './Models/Board';
import { Item } from './Models/Item';
import { ItemUpdate } from './Models/ItemUpdate';

export class CachedMondayService implements IMondayService {
    constructor(private mondayService: IMondayService) {}

    public async getAllItemMessages(
        startDate: Date,
        endDate: Date
    ): Promise<ItemUpdate[]> {
        const cachedFunc = defineCachedFunction(
            async (startDate, endDate) =>
                await this.mondayService.getAllItemMessages(startDate, endDate),
            {
                maxAge: 10 * 60,
                name: 'getAllItemMessages',
            }
        );
        const response = await cachedFunc(startDate, endDate);
        return response;
    }

    public async getAllItemCreationActivityLogs(
        boards: number[],
        startDate: Date,
        endDate: Date
    ): Promise<ActivityLog[]> {
        const cachedFunc = defineCachedFunction(
            async (boards, startDate, endDate) =>
                await this.mondayService.getAllItemCreationActivityLogs(
                    boards,
                    startDate,
                    endDate
                ),
            {
                maxAge: 10 * 60,
                name: 'getAllItemCreationActivityLogs',
            }
        );
        const response = await cachedFunc(boards, startDate, endDate);
        return response;
    }

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    public async getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string }[]>> {
        const cachedFunc = defineCachedFunction(
            async (boardIds) =>
                await this.mondayService.getGroupsForBoards(boardIds),
            {
                maxAge: 60 * 60,
                name: 'getGroupsForBoards',
            }
        );
        const response = await cachedFunc(boardIds);
        return response;
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    public async getAllRelatedItems(
        activityLogs: ActivityLog[]
    ): Promise<Item[]> {
        const cachedFunc = defineCachedFunction(
            async (activityLogs) =>
                await this.mondayService.getAllRelatedItems(activityLogs),
            {
                maxAge: 10 * 60,
                name: 'getAllRelatedItems',
            }
        );
        const response = await cachedFunc(activityLogs);
        return response;
    }

    /*
     * @param itemIds - Collection of monday IDs corresponding to the desired Items
     * @returns Collection of all the items referenced by the given monday IDs
     */
    public async getItemsById(itemIds: number[]): Promise<Item[]> {
        const cachedFunc = defineCachedFunction(
            async (itemIds) => await this.mondayService.getItemsById(itemIds),
            {
                maxAge: 10 * 60,
                name: 'getItemsById',
            }
        );
        const response = await cachedFunc(itemIds);
        return response;
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
        return this.mondayService.filterActivityLogsByStatus(
            activityLogs,
            statusText
        );
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
        const cachedFunc = defineCachedFunction(
            async (boards, startDate, endDate) =>
                await this.mondayService.getAllStatusActivityLogs(
                    boards,
                    startDate,
                    endDate
                ),
            {
                maxAge: 10 * 60,
                name: 'getAllStatusActivityLogs',
            }
        );
        const response = await cachedFunc(boards, startDate, endDate);
        return response;
    }

    /**
     * @param boardId - Id of a board on Monday.com
     * @returns A map of status IDs to their label text
     */
    public async getStatusLabels(
        boardIds: number[]
    ): Promise<Record<string, Record<number, string>>> {
        const cachedFunc = defineCachedFunction(
            async (boardIds: number[]) =>
                await this.mondayService.getStatusLabels(boardIds),
            {
                maxAge: 60 * 60,
                name: 'getStatusLabels',
            }
        );
        return await cachedFunc(boardIds);
    }

    public async getAllMondayUsers(): Promise<User[]> {
        const cachedFunc = defineCachedFunction(
            async () => await this.mondayService.getAllMondayUsers(),
            {
                maxAge: 60 * 60,
                name: 'getAllMondayUsers',
            }
        );
        const response = await cachedFunc();
        return response;
    }

    /**
     * @param boardIds - Collection of board IDs
     * @returns Array of Board objects
     */
    public async getBoards(boardIds: number[]): Promise<Board[]> {
        const cachedFunc = defineCachedFunction(
            async (boardIds) => await this.mondayService.getBoards(boardIds),
            {
                maxAge: 60 * 60,
                name: 'getBoards',
            }
        );
        const response = await cachedFunc(boardIds);
        return response;
    }
}
