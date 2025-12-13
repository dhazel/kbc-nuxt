export enum PrayerOrderType {
    m2mInformed = 'Month-to-month Informed',
    m2mInspired = 'Month-to-month Inspired',
    annualInformed = 'Annual Informed',
    annualInspired = 'Annual Inspired',
}

export interface PrayerOrderData {
    type: PrayerOrderType;
    status: string;
    workedDate: Date;
    title: string;
    board: string;
    intercessor: string;
    group: string;
}
