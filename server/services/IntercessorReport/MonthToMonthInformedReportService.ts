import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '@/types/prayerOrder';
import { PrayerOrderType } from '@/types/prayerOrder';
import type { IMondayService, Item } from '../Monday/IMondayService';

export class MonthToMonthInformedReportService
    implements IIntercessorReportService
{
    constructor(private mondayService: IMondayService) {}

    private boardIds: number[] = [
        18130780948, 9731839830, 9675066534, 9913642037, 9804560302,
        18080835095,
    ];

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            const boardIds = [
                18130780948, 9731839830, 9675066534, 9913642037, 9804560302,
                18080835095,
            ];

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

            prayerOrders = this.makePrayerOrderList(
                closedActivityLogs,
                closedItems,
                await this.mondayService.getStatusLabels(boardIds[0]),
                await this.mondayService.getAllMondayUsers()
            );

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }

    private makePrayerOrderList(
        closedChanges: any,
        items: Item[],
        labelMap: Record<number, string>,
        allUsersMap: Record<string, string>
    ) {
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
                    group: { id: 'none', title: 'Deleted' },
                };
            }
            prayerOrders.push({
                type: PrayerOrderType.monthToMonthInformed,
                status: status,
                workedDate: new Date(unixMs),
                title: item.name,
                board: changeLog.boardName || 'Unknown',
                intercessor: allUsersMap[changeLog.user_id] || 'Unknown',
                group: item.group?.title || 'Unknown',
            });
        }
        return prayerOrders;
    }
}
