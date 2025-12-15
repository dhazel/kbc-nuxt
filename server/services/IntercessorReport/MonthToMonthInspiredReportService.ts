import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '@/types/prayerOrder';
import { PrayerOrderType } from '@/types/prayerOrder';
import type { IMondayService, Item } from '../Monday/IMondayService';

export class MonthToMonthInspiredReportService implements IIntercessorReportService {
    constructor(private mondayService: IMondayService) {}

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

            const newActivityLogs =
                await this.mondayService.getAllItemCreationActivityLogs(
                    boardIds,
                    startDate,
                    endDate
                );

            const newInspiredItems = (
                await this.mondayService.getAllRelatedItems(newActivityLogs)
            ).filter((l) => l.group?.title.toLowerCase().includes('inspired'));

            prayerOrders = this.makePrayerOrderList(
                newActivityLogs,
                newInspiredItems,
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
        changeLogs: any,
        items: Item[],
        labelMap: Record<number, string>,
        allUsersMap: Record<string, string>
    ) {
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
                type: PrayerOrderType.monthToMonthInspired,
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
