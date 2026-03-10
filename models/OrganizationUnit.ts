import type { PrayerOrder } from './PrayerOrder';

export interface OrganizationUnit {
    name: string;
    description?: string;
    prayerOrders: PrayerOrder[];
}
