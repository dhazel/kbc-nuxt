import type { IIntercessorReportService } from './IIntercessorReportService';
import { PrayerOrderType, type PrayerOrderDto as PrayerOrderDto } from '~/../types/prayerOrderDto';
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
    ): Promise<PrayerOrderDto[]> {
        try {
            await this.ensureReady();

            let prayerOrders: PrayerOrderDto[] = [];

            const statusActivityLogs =
                await this.mondayService.getAllStatusActivityLogs(
                    this.boardIds,
                    startDate,
                    endDate
                );

            const activityLogs = this.mondayService.filterActivityLogsByStatus(
                statusActivityLogs,
                ['replied', 'kbc reply']
            );

            const items =
                await this.mondayService.getAllRelatedItems(activityLogs);

            await this.loadMissingStatusLabels(items);

            prayerOrders = this.makePrayerOrderList({ activityLogs, items });

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }
}
