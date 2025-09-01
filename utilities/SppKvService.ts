import type { IClientKvStore } from "./IClientKvStore";
import type { ISppService } from "./ISppService";
import type { PrayerOrder } from "../models/PrayerOrder";
import type { User } from "../models/User";

export class SppKvService implements ISppService {
    constructor(private kvStore: IClientKvStore) {}

    async addPrayerOrder(user: User, prayerOrder: PrayerOrder): Promise<void> {
        let prayerOrdersKey = `po:${user.email}`;
        let prayerOrders = await this.kvStore.getItem(prayerOrdersKey);
        if (!prayerOrders) {
            prayerOrders = [];
        }
        prayerOrders.push(prayerOrder);
        await this.kvStore.setItem(prayerOrdersKey, prayerOrders);
    }

    async getPrayerOrders(user: User): Promise<PrayerOrder[]> {
        throw new Error("Method not implemented.");
    }
}

// Re-export interfaces for convenience
export type { ISppService } from "./ISppService";

