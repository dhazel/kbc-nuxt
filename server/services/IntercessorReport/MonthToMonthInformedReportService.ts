import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '~/../types/prayerOrder';
import { PrayerOrderType } from '~/../types/prayerOrder';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';

export class MonthToMonthInformedReportService
    extends AbstractIntercessorReportService
    implements IIntercessorReportService
{
    constructor(
        mondayService: IMondayService,
        boardIdProvider: IBoardIdProvider
    ) {
        super(mondayService, boardIdProvider);
        this.prayerOrderType = PrayerOrderType.monthToMonthInformed;
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
}
