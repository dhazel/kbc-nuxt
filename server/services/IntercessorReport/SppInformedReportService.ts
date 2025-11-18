import type {
    IIntercessorReportService,
    PrayerOrderData,
} from './IIntercessorReportService';
import type { IMondayService, Item, ItemsResponse } from '../Monday/IMondayService';

export class SppInformedReportService implements IIntercessorReportService {
    constructor(private mondayService: IMondayService) {}

    async getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            const boardIds = [
                18130780948, 9731839830, 9675066534, 9913642037, 9804560302,
                18080835095,
            ];

            let prayerOrders: PrayerOrderData[] = [];

            const activityLogs = await this.mondayService.getAllStatusActivityLogs(boardIds, startDate, endDate);

            const closedActivityLogs = this.mondayService.filterActivityLogsByStatus(activityLogs, 'closed');

            if (closedActivityLogs.length !== 0) {
                const closedItems = await this.mondayService.getAllRelatedItems(closedActivityLogs);

                prayerOrders = this.makePrayerOrderList(
                    closedActivityLogs,
                    closedItems,
                    await this.mondayService.getStatusLabels(boardIds[0]),
                    await this.mondayService.getAllMondayUsers()
                );
            }

            return prayerOrders;
        } catch (error) {
            console.error('Error in getClosedPrayerOrders:', error);
            throw error;
        }
    }

    private makePrayerOrderList(
        closedChanges: any,
        items: ItemsResponse,
        labelMap: Record<number, string>,
        allUsersMap: Record<string, string>
    ) {
        const prayerOrders: PrayerOrderData[] = [];
        for (const changeLog of closedChanges) {
            const unixMs = Math.round(
                parseInt(changeLog.created_at) / 10000
            );
            const changeLogData = JSON.parse(changeLog.data);
            let item = items.items.filter(
                (item: Item) => changeLogData.pulse_id == item.id
            )[0];
            let status = 'Unknown';
            if (item) {
                const statusColumnValue = item.column_values.find(
                    (cv) => cv.id === 'status'
                );
                if (statusColumnValue) {
                    try {
                        const parsedValue = JSON.parse(
                            statusColumnValue.value
                        );
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
                    group: { id: 'none', title: 'Unknown' },
                };
            }
            prayerOrders.push({
                status: status,
                closeDate: new Date(unixMs),
                title: item.name,
                board: changeLog.boardName || 'Unknown',
                intercessor: allUsersMap[changeLog.user_id] || 'Unknown',
                group: item.group?.title || 'Unknown',
            });
        }
        return prayerOrders;
    }

}
