export interface PrayerOrderData {
    status: string;
    closeDate: Date;
    title: string;
    board: string;
    intercessor: string;
    group: string;
}

export interface IIntercessorReportService {
    getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
