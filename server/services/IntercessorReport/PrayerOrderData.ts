import { PrayerOrderType } from "./IIntercessorReportService";


export interface PrayerOrderData {
    type: PrayerOrderType;
    status: string;
    workedDate: Date;
    title: string;
    board: string;
    intercessor: string;
    group: string;
}

