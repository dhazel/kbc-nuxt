export interface PrayerOrderData {
    status: string;
    closeDate: Date;
    title: string;
    intercessor: string;
    board: string;
}

export interface IReportService {
    getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
