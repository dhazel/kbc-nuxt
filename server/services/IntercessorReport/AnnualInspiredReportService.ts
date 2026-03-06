import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderDto } from '~/../types/prayerOrderDto';
import { PrayerOrderType } from '~/../types/prayerOrderDto';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';
import type { PrayerActivity } from './PrayerActivity';

export class AnnualInspiredReportService
    extends AbstractIntercessorReportService
    implements IIntercessorReportService
{
    constructor(
        mondayService: IMondayService,
        boardIdProvider: IBoardIdProvider
    ) {
        super(mondayService, boardIdProvider);
        this.prayerOrderType = PrayerOrderType.annualInspired;
    }

    private async fetchPrayerOrderData(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerActivity> {
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

        return { activityLogs: newActivityLogs, items: newInspiredItems };
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
            await this.ensureReady();
            const prayerActivity = await this.fetchPrayerOrderData(
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
