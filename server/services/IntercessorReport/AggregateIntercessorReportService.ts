import type {
    IIntercessorReportService,
} from './IIntercessorReportService';
import type { PrayerOrderDto } from '~/../types/prayerOrderDto';

export class AggregateIntercessorReportService implements IIntercessorReportService {
    constructor(private intercessorReportServices: IIntercessorReportService[]) {}

    async getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderDto[]> {
        let prayerOrders: PrayerOrderDto[] = [];

        prayerOrders = (await Promise.all(this.intercessorReportServices.map(async (service) => {
            return await service.getWorkedPrayerOrders(startDate, endDate);
        }))).flatMap(po => po);

        return prayerOrders;
    }
}
