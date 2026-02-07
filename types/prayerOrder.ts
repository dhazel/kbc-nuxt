export enum PrayerOrderType {
    monthToMonthInformed = 'Month-to-month Informed',
    monthToMonthInspired = 'Month-to-month Inspired',
    annualInformed = 'Annual Informed',
    annualInspired = 'Annual Inspired',
}

export interface PrayerOrderData {
    type: PrayerOrderType;
    currentStatus: string;
    workedDate: Date;
    title: string;
    currentBoard: string;
    intercessor: string;
    currentGroup: string;
}
