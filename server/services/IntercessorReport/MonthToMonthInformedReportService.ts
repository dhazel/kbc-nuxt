import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '~/../types/prayerOrder';
import { PrayerOrderType } from '~/../types/prayerOrder';
import type { IMondayService, Item, User } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';

export class MonthToMonthInformedReportService implements IIntercessorReportService {
    constructor(
        private mondayService: IMondayService,
        private boardIdProvider: IBoardIdProvider
    ) {}

    private boardIds!: number[];

    private statusLabels?: Record<string, Record<number, string>>;
    private allUsersMap?: Record<string, string>;

    private async ensureReady(): Promise<void> {
        if (!this.boardIds) {
            this.boardIds = await this.boardIdProvider.getBoardIds(
                'month-to-month',
                'informed'
            );
        }
        if (!this.statusLabels || !this.allUsersMap) {
            this.statusLabels = await this.mondayService.getStatusLabels(
                this.boardIds
            );
            const allUsers = await this.mondayService.getAllMondayUsers();
            this.allUsersMap = allUsers.reduce(
                (map: Record<string, string>, user: User) => {
                    map[user.id] = user.name;
                    return map;
                },
                {}
            );
        }
    }

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            await this.ensureReady();

            let prayerOrders: PrayerOrderData[] = [];

            const activityLogs =
                await this.mondayService.getAllStatusActivityLogs(
                    this.boardIds,
                    startDate,
                    endDate
                );

            const closedActivityLogs =
                this.mondayService.filterActivityLogsByStatus(
                    activityLogs,
                    'closed'
                );

            const closedItems =
                await this.mondayService.getAllRelatedItems(closedActivityLogs);

            await this.loadMissingStatusLabels(closedItems);

            prayerOrders = this.makePrayerOrderList(
                closedActivityLogs,
                closedItems
            );

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }

    private makePrayerOrderList(closedChanges: any, items: Item[]) {
        const prayerOrders: PrayerOrderData[] = [];
        for (const changeLog of closedChanges) {
            const unixMs = Math.round(parseInt(changeLog.created_at) / 10000);
            const changeLogData = JSON.parse(changeLog.data);
            let item = items.filter(
                (item: Item) => changeLogData.pulse_id == item.id
            )[0];
            let status = 'Unknown';
            if (item) {
                const statusColumnValue = item.column_values.find(
                    (cv) => cv.id === 'status'
                );
                if (statusColumnValue) {
                    try {
                        const parsedValue = JSON.parse(statusColumnValue.value);
                        const index = parsedValue?.index;
                        const boardId = item.board?.id;
                        status = boardId
                            ? this.statusLabels![boardId]?.[index] || 'Unknown'
                            : 'Unknown';
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
                    group: { id: 'none', title: 'Deleted' },
                };
            }
            prayerOrders.push({
                type: PrayerOrderType.monthToMonthInformed,
                currentStatus: status,
                workedDate: new Date(unixMs),
                title: item.name,
                currentBoard: item.board?.name || 'Unknown',
                intercessor: this.allUsersMap![changeLog.user_id] || 'Unknown',
                currentGroup: item.group?.title || 'Unknown',
            });
        }
        return prayerOrders;
    }

    private async loadMissingStatusLabels(items: Item[]): Promise<void> {
        const itemBoardIds = new Set<string>();
        for (const item of items) {
            if (item.board?.id) itemBoardIds.add(item.board.id);
        }
        const missingBoardIds: number[] = [];
        for (const id of itemBoardIds) {
            if (!this.statusLabels![id]) missingBoardIds.push(parseInt(id));
        }
        if (missingBoardIds.length > 0) {
            const fetched =
                await this.mondayService.getStatusLabels(missingBoardIds);
            this.statusLabels = { ...this.statusLabels, ...fetched };
        }
    }
}
