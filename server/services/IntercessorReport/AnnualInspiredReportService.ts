import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderDto } from '~/../types/prayerOrderDto';
import { PrayerOrderType } from '~/../types/prayerOrderDto';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';

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

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderDto[]> {
        try {
            await this.ensureReady();

            let prayerOrders: PrayerOrderDto[] = [];

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

            prayerOrders = this.makePrayerOrderList({
                activityLogs: newActivityLogs,
                items: newInspiredItems,
            });

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }
}
