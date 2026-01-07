import type { IClientKvStore } from "./IClientKvStore";
import type { ISppService } from "./ISppService";
import type { PrayerOrder } from "../models/PrayerOrder";
import type { User } from "../models/User";

export class SppKvService implements ISppService {
    constructor(private kvStore: IClientKvStore) {}

    async addPrayerOrder(user: User, prayerOrder: PrayerOrder): Promise<void> {
        const prayerOrdersKey = `po:${user.email}`;
        let prayerOrders = await this.kvStore.getItem(prayerOrdersKey);
        if (!prayerOrders) {
            prayerOrders = [];
        }
        prayerOrders.push(prayerOrder);
        await this.kvStore.setItem(prayerOrdersKey, prayerOrders);
    }

    async getPrayerOrders(user: User): Promise<PrayerOrder[]> {
        const prayerOrdersKey = `po:${user.email}`;
        const prayerOrders = await this.kvStore.getItem(prayerOrdersKey);
        return prayerOrders || [];
    }
}


