import type { IIntercessorReportService } from './IIntercessorReportService';
import { PrayerOrderType, type PrayerOrderData } from '~/../types/prayerOrder';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';

export class AnnualInformedReportService
    extends AbstractIntercessorReportService
    implements IIntercessorReportService
{
    constructor(
        mondayService: IMondayService,
        boardIdProvider: IBoardIdProvider
    ) {
        super(mondayService, boardIdProvider);
        this.prayerOrderType = PrayerOrderType.annualInformed;
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
}
