import type { ActivityLog, Item } from '../Monday/IMondayService';

export interface PrayerActivity {
    activityLogs: ActivityLog[];
    items: Item[];
}
