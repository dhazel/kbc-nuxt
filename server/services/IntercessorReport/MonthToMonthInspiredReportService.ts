import type { IIntercessorReportService } from './IIntercessorReportService';
import type { PrayerOrderData } from '~/../types/prayerOrder';
import { PrayerOrderType } from '~/../types/prayerOrder';
import type { IMondayService } from '../Monday/IMondayService';
import type { IBoardIdProvider } from '../BoardIdProvider/IBoardIdProvider';
import { AbstractIntercessorReportService } from './AbstractIntercessorReportService';

export class MonthToMonthInspiredReportService
    extends AbstractIntercessorReportService
    implements IIntercessorReportService
{
    constructor(
        mondayService: IMondayService,
        boardIdProvider: IBoardIdProvider
    ) {
        super(mondayService, boardIdProvider);
        this.prayerOrderType = PrayerOrderType.monthToMonthInspired;
    }

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        try {
            await this.ensureReady();

            let prayerOrders: PrayerOrderData[] = [];

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

            prayerOrders = this.makePrayerOrderList(
                newActivityLogs,
                newInspiredItems
            );

            return prayerOrders;
        } catch (error) {
            console.error('Error in getWorkedPrayerOrders:', error);
            throw error;
        }
    }
}
