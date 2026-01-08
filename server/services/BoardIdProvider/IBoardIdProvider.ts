export interface IBoardIdProvider {
    getBoardIds(
        subscriptionType: 'month-to-month' | 'annual',
        prayerOrderType: 'informed' | 'inspired'
    ): Promise<number[]>;
}
