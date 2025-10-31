export interface PrayerOrderData {
    status: string;
    closeDate: Date;
    title: string;
    intercessor: string;
}

export interface IAdminService {
    getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
