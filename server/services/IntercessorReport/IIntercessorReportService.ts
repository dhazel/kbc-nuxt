import { PrayerOrderData } from "./PrayerOrderData";

export interface IIntercessorReportService {
    getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
