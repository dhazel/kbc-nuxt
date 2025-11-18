import {ActivityLog, IMondayService, ItemsResponse,} from "./IMondayService";

export class CachedMondayService implements IMondayService {
    constructor(private mondayService: IMondayService) {}

    /**
     * @param boardIds - Collection of board IDs
     * @returns A record mapping board IDs to their groups (id and title)
     */
    public async getGroupsForBoards(
        boardIds: number[]
    ): Promise<Record<number, { id: string; title: string; }[]>> {
        const cachedFunc = defineCachedFunction(async (boardIds) => 
            await this.mondayService.getGroupsForBoards(boardIds),
            {
                maxAge: 60 * 60
            });
        return await cachedFunc(boardIds);
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @returns Collection of all the items referenced by the given activity logs
     */
    public async getAllRelatedItems(activityLogs: ActivityLog[]): Promise<ItemsResponse> {
        const cachedFunc = defineCachedFunction(async (activityLogs) => 
            await this.mondayService.getAllRelatedItems(activityLogs),
            {
                maxAge: 10 * 60
            });
        return await cachedFunc(activityLogs);
    }

    /**
     * @param activityLogs - Collection of activity logs
     * @param statusText - The text of the status that the activity log references
     * @returns Collection of activity logs filtered to contain only those with the given status
     */
    public filterActivityLogsByStatus(activityLogs: ActivityLog[], statusText: string) {
        return this.mondayService.filterActivityLogsByStatus(activityLogs, statusText);
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
        const cachedFunc = defineCachedFunction(async (boards, startDate, endDate) => 
            await this.mondayService.getAllStatusActivityLogs(boards, startDate, endDate),
            {
                maxAge: 10 * 60
            });
        return await cachedFunc(boards, startDate, endDate);
    }

    /**
     * @param boardId - Id of a board on Monday.com
     * @returns A map of status IDs to their label text
     */
    public async getStatusLabels(boardId: number): Promise<Record<number, string>> {
        const cachedFunc = defineCachedFunction(async (boardId) => 
            await this.mondayService.getStatusLabels(boardId),
            {
                maxAge: 60 * 60
            });
        return await cachedFunc(boardId);
    }

    public async getAllMondayUsers(): Promise<Record<string, string>> {
        const cachedFunc = defineCachedFunction(async () => 
            await this.mondayService.getAllMondayUsers(),
            {
                maxAge: 60 * 60
            });
        return await cachedFunc();
    }
}
