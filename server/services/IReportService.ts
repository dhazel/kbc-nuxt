export interface PrayerOrderData {
    status: string;
    closeDate: Date;
    title: string;
    lastChangedBy: string;
    board: string;
    intercessor: string;
}

export interface IReportService {
    getClosedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
