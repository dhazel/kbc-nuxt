import type { PrayerOrder } from "../models/PrayerOrder";
import type { User } from "../models/User";

export interface ISppService {
  addPrayerOrder(user: User, prayerOrder: PrayerOrder): Promise<void>;
  getPrayerOrders(user: User): Promise<PrayerOrder[]>;
}

