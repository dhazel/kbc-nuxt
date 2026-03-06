import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderDto } from '~/../types/prayerOrderDto';
import { PrayerOrderType } from '~/../types/prayerOrderDto';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';
import type { PrayerActivity } from './PrayerActivity';

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

    public async getPrayerActivity(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerActivity> {
        await this.init();

        const activityLogs = await this.mondayService.getAllStatusActivityLogs(
            this.boardIds,
            startDate,
            endDate
        );

        const closedActivityLogs =
            this.mondayService.filterActivityLogsByStatus(activityLogs, [
                'closed',
                'kbc reply',
            ]);

        const closedItems =
            await this.mondayService.getAllRelatedItems(closedActivityLogs);

        await this.loadMissingStatusLabels(closedItems);

        return { activityLogs: closedActivityLogs, items: closedItems };
    }

    private createPrayerOrders(
        prayerActivity: PrayerActivity
    ): PrayerOrderDto[] {
        return this.makePrayerOrderList(prayerActivity);
    }

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderDto[]> {
        try {
            await this.init();
            const prayerActivity = await this.getPrayerActivity(
                startDate,
                endDate
            );
            return this.createPrayerOrders(prayerActivity);
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }
}
