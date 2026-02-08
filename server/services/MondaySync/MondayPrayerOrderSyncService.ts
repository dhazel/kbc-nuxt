import type { MondayBoard, PrismaClient } from '@prisma/client';
import type { IMondaySyncService } from './IMondaySyncService';
import type { IMondayService } from '../Monday/IMondayService';

export class MondayPrayerOrderSyncService implements IMondaySyncService {
    constructor(
        private mondayService: IMondayService,
        private prisma: PrismaClient
    ) {}

    /**
     * Sync data from Monday
     */
    async sync(): Promise<void> {
        const boards = await this.getAllMondayBoards();

        let prayerOrderSyncResults: PrayerOrderSyncResult[] = [];
        for (const board of boards) {
            prayerOrderSyncResults.push(await this.syncPrayerOrders(board));
        }

        const startDate: Date = new Date(); //TODO: get the earliest sync date from the collection of `prayerOrderSyncResults`
        const endDate: Date = new Date();
        await this.syncPrayerOrderMessages(startDate, endDate);
    }

    async syncPrayerOrderMessages(startDate: Date, endDate: Date) {
        //TODO: from monday, get all item messages between the startDate and endDate

        //TODO: in the db, create Message records for each item message, link them to the appropriate PrayerOrder by the monday ID, the Message `content` field corresponds to the ItemUpdate `body` field
    }

    async syncPrayerOrders(board: MondayBoard): PrayerOrderSyncResult {
        //TODO: from the db, get the last sync date from the MondayPrayerOrderSync model, if no record is found, use January 1st 2024

        //TODO: from monday, get all item creation activity logs between the last sync date and today

        //TODO: from monday, get the corresponding item for each item creation activity log

        //TODO: in the db, create PrayerOrders for each item creation log, where a PrayerOrder does not already exist

        //TODO: from monday, get current status of all PrayerOrders that are not already in the Closed state

        //TODO: in the db, update the status of all PrayerOrders (only statuses that already exist in the db can be used, so some from monday will have to be translated to an approved value)
    }

    async getAllMondayBoards(): Promise<Array<MondayBoard>> {
        return this.prisma.mondayBoard.findMany();
    }
}
