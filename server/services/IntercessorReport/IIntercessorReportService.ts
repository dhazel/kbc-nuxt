import type { PrayerOrderDto } from '~/../types/prayerOrderDto';
import type { PrayerActivity } from './PrayerActivity';

export interface IIntercessorReportService {
    getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderDto[]>;
    getPrayerActivity(startDate: Date, endDate: Date): Promise<PrayerActivity>;
}
