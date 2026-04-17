import { ActivityLog } from "../Monday/Models/ActivityLog";
import { Item } from "../Monday/Models/Item";

export interface PrayerActivity {
    activityLogs: ActivityLog[];
    items: Item[];
}
