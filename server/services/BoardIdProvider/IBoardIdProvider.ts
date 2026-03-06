import type { PrayerOrderType } from "~~/types/prayerOrderDto";

export interface IBoardIdProvider {
    getBoardIds(
        prayerOrderType: PrayerOrderType
    ): Promise<number[]>;
}
