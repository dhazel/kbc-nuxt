export interface PrayerOrderData {
    status: string;
    workedDate: Date;
    title: string;
    board: string;
    intercessor: string;
    group: string;
}

export interface IIntercessorReportService {
    getWorkedPrayerOrders(
        startDate: Date,
        endDate: Date
    ): Promise<PrayerOrderData[]>;
}
