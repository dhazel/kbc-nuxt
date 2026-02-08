import type { PrayerOrderType } from "~~/types/prayerOrder";

export interface IBoardIdProvider {
    getBoardIds(
        prayerOrderType: PrayerOrderType
    ): Promise<number[]>;
}
