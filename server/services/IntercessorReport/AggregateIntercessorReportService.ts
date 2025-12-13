import type {
    IIntercessorReportService,
} from './IIntercessorReportService';
import type { PrayerOrderData } from "./PrayerOrderData";

export class AggregateIntercessorReportService implements IIntercessorReportService {
    constructor(private intercessorReportServices: IIntercessorReportService[]) {}

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]> {
        let prayerOrders: PrayerOrderData[] = [];

        prayerOrders = (await Promise.all(this.intercessorReportServices.map(async (service) => {
            return await service.getWorkedPrayerOrders(startDate, endDate);
        }))).flatMap(po => po);

        return prayerOrders;
    }
}
