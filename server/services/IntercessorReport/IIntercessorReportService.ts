import type { PrayerOrderDto } from '~/../types/prayerOrderDto';

export interface IIntercessorReportService {
    getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderDto[]>;
}
