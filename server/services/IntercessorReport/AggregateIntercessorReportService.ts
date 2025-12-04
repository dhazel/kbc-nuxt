import type {
    IIntercessorReportService,
    PrayerOrderData,
} from './IIntercessorReportService';

export class AggregateIntercessorReportService
    implements IIntercessorReportService
{
    constructor(
        private intercessorReportServices: IIntercessorReportService[]
    ) {}

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        let prayerOrders: PrayerOrderData[] = [];

        for (const service of this.intercessorReportServices) {
            const results = await service.getWorkedPrayerOrders(
                startDate,
                endDate
            );
            prayerOrders.push(...results);
        }

        return prayerOrders;
    }
}
