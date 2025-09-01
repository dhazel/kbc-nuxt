import type { IClientKvStore } from "./IClientKvStore";
import type { ISppService } from "./ISppService";
import type { PrayerOrder } from "../models/PrayerOrder";
import type { User } from "../models/User";

export class SppKvService implements ISppService {
    constructor(private kvStore: IClientKvStore) {}

    addPrayerOrder(user: User, prayerOrder: PrayerOrder): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getPrayerOrders(user: User): Promise<PrayerOrder[]> {
        throw new Error("Method not implemented.");
    }
}

// Re-export interfaces for convenience
export type { ISppService } from "./ISppService";

