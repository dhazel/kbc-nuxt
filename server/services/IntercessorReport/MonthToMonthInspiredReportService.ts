import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '~/../types/prayerOrder';
import { PrayerOrderType } from '~/../types/prayerOrder';
import type { IMondayService, Item } from '../Monday/IMondayService';

export class MonthToMonthInspiredReportService
    implements IIntercessorReportService
{
    constructor(private mondayService: IMondayService) {}

    private boardIds: number[] = [
        18130780948, 9731839830, 9675066534, 9913642037, 9804560302,
        18080835095,
    ];

    private statusLabels?: Record<string, Record<number, string>>;
    private allUsersMap?: Record<string, string>;

    private async ensureReady(): Promise<void> {
        if (!this.statusLabels || !this.allUsersMap) {
            this.statusLabels = await this.mondayService.getStatusLabels(
                this.boardIds
            );
            this.allUsersMap = await this.mondayService.getAllMondayUsers();
        }
    }

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            await this.ensureReady();

            let prayerOrders: PrayerOrderData[] = [];

            const newActivityLogs =
                await this.mondayService.getAllItemCreationActivityLogs(
                    this.boardIds,
                    startDate,
                    endDate
                );

            const newInspiredItems = (
                await this.mondayService.getAllRelatedItems(newActivityLogs)
            ).filter((l) => l.group?.title.toLowerCase().includes('inspired'));

            await this.loadMissingStatusLabels(newInspiredItems);

            prayerOrders = this.makePrayerOrderList(
                newActivityLogs,
                newInspiredItems
            );

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }

    private makePrayerOrderList(changeLogs: any, items: Item[]) {
        const prayerOrders: PrayerOrderData[] = [];
        for (const changeLog of changeLogs) {
            const unixMs = Math.round(parseInt(changeLog.created_at) / 10000);
            const changeLogData = JSON.parse(changeLog.data);
            let filteredItems = items.filter(
                (item: Item) => changeLogData.pulse_id == item.id
            );
            if (filteredItems.length === 0) continue;

            let item = filteredItems[0];
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
                type: PrayerOrderType.monthToMonthInspired,
                status: status,
                workedDate: new Date(unixMs),
                title: item.name,
                board: item.board?.name || 'Unknown',
                intercessor: this.allUsersMap![changeLog.user_id] || 'Unknown',
                group: item.group?.title || 'Unknown',
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
