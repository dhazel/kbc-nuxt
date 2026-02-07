export enum PrayerOrderType {
    monthToMonthInformed = 'Month-to-month Informed',
    monthToMonthInspired = 'Month-to-month Inspired',
    annualInformed = 'Annual Informed',
    annualInspired = 'Annual Inspired',
}

export interface PrayerOrderData {
    type: PrayerOrderType;
    workedDate: Date;
    title: string;
    board: string;
    intercessor: string;
    currentStatus: string;
    currentBoard: string;
    currentGroup: string;
}
