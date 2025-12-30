import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '@/types/prayerOrder';
import { PrayerOrderType } from '@/types/prayerOrder';
import type { IMondayService, Item } from '../Monday/IMondayService';

export class AnnualInformedReportService implements IIntercessorReportService {
    constructor(private mondayService: IMondayService) {}

    private boardIds: number[] = [
        5250873809, // AHAC
        8747424435, // Impact
        18213975268, // NCF
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

            const statusActivityLogs =
                await this.mondayService.getAllStatusActivityLogs(
                    this.boardIds,
                    startDate,
                    endDate
                );

            const activityLogs = this.mondayService.filterActivityLogsByStatus(
                statusActivityLogs,
                'replied'
            );

            const items =
                await this.mondayService.getAllRelatedItems(activityLogs);

            await this.loadMissingStatusLabels(items);

            prayerOrders = this.makePrayerOrderList(activityLogs, items);

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
                type: PrayerOrderType.annualInformed,
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
