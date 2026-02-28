import type { MondayBoard, PrismaClient } from '@prisma/client';
import type { IMondaySyncService } from './IMondaySyncService';
import type {
    IMondayService,
    ColumnValue,
    ActivityLog,
    Item,
} from '../Monday/IMondayService';
import { PrayerOrderSyncResult } from './PrayerOrderSyncResult';

export class MondayPrayerOrderSyncService implements IMondaySyncService {
    constructor(
        private mondayService: IMondayService,
        private prisma: PrismaClient
    ) {}

    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    private async processMessage(
        tx: any,
        item: any,
        creatorId: string | number,
        prayerOrderId: number,
        parentMessageId?: number
    ): Promise<any | null> {
        const author = await tx.user.findFirst({
            where: { mondayId: creatorId },
        });
        if (!author) return null;

        const existing = await tx.message.findFirst({
            where: { mondayId: item.id },
        });

        let message;
        if (existing) {
            message = await tx.message.update({
                where: { id: existing.id },
                data: {
                    content: item.body,
                    updatedAt: new Date(item.edited_at),
                },
            });
        } else {
            message = await tx.message.create({
                data: {
                    prayerOrderId,
                    authorId: author.id,
                    content: item.body,
                    mondayId: item.id,
                    createdAt: new Date(item.created_at),
                    updatedAt: new Date(item.edited_at),
                    ...(parentMessageId !== undefined && { parentMessageId }),
                },
            });
        }

        await this.syncViewers(tx, message.id, item.viewers);

        return message;
    }

    private async syncViewers(
        tx: any,
        messageId: number,
        newViewers: any[]
    ): Promise<void> {
        const currentViews = await tx.messageView.findMany({
            where: { messageId },
            select: { id: true, userId: true },
        });
        const newUserIds = new Set<number>();

        for (const viewer of newViewers) {
            const user = await tx.user.findFirst({
                where: { mondayId: viewer.userMondayId },
            });
            if (!user) continue;
            newUserIds.add(user.id);
            await tx.messageView.upsert({
                where: {
                    messageId_userId: {
                        messageId,
                        userId: user.id,
                    },
                },
                update: {
                    viewedAt: viewer.date,
                },
                create: {
                    messageId,
                    userId: user.id,
                    viewedAt: viewer.date,
                },
            });
        }

        for (const current of currentViews) {
            if (!newUserIds.has(current.userId)) {
                await tx.messageView.delete({
                    where: { id: current.id },
                });
            }
        }
    }

    /**
     * Sync data from Monday
     */
    async sync(): Promise<void> {
        const boards = await this.getAllMondayBoards();

        const prayerOrderSyncResults: PrayerOrderSyncResult[] = [];
        for (const board of boards) {
            console.log('Syncing PrayerOrders for board: ', board.boardName);
            prayerOrderSyncResults.push(await this.syncPrayerOrders(board));
        }

        const startDate: Date = new Date(
            Math.min(
                ...prayerOrderSyncResults.map((r) => r.startDate.getTime())
            )
        );
        const endDate: Date = new Date();

        console.log(
            'Syncing PrayerOrder messages from start date: ',
            startDate
        );
        await this.syncPrayerOrderMessages(startDate, endDate);
    }

    async syncPrayerOrderMessages(
        startDate: Date,
        endDate: Date
    ): Promise<void> {
        const itemUpdates = await this.mondayService.getAllItemMessages(
            startDate,
            endDate
        );

        const batches = this.chunkArray(itemUpdates, 100);
        for (const batch of batches) {
            console.log('Starting message batch');
            await this.prisma.$transaction(async (tx) => {
                for (const update of batch) {
                    const prayerOrder = await tx.prayerOrder.findFirst({
                        where: { mondayId: update.item.id },
                    });
                    if (!prayerOrder) continue;

                    const mainMessage = await this.processMessage(
                        tx,
                        update,
                        update.creator.id,
                        prayerOrder.id
                    );
                    if (!mainMessage) continue;

                    // Process replies
                    for (const reply of update.replies) {
                        await this.processMessage(
                            tx,
                            reply,
                            reply.creator.id,
                            prayerOrder.id,
                            mainMessage.id
                        );
                    }
                }
            });
        }
    }

    async syncPrayerOrders(board: MondayBoard): Promise<PrayerOrderSyncResult> {
        // Get last sync date
        const syncRecord = await this.prisma.mondayPrayerOrderSync.findUnique({
            where: { mondayBoardId: board.id },
        });
        const lastSyncDate = syncRecord?.lastSyncedAt ?? new Date(2024, 0, 1);

        // Get item creation activity logs
        const creationLogs =
            await this.mondayService.getAllItemCreationActivityLogs(
                [Number(board.mondayId)],
                lastSyncDate,
                new Date()
            );

        // Get corresponding items
        const items = await this.mondayService.getAllRelatedItems(creationLogs);

        await this.syncPrayerOrderStatusUpdates(board);

        // Create PrayerOrders
        let syncedCount = await this.createPrayerOrders(
            items,
            creationLogs,
            board
        );

        // Update last sync date
        await this.prisma.mondayPrayerOrderSync.upsert({
            where: { mondayBoardId: board.id },
            update: { lastSyncedAt: new Date() },
            create: {
                mondayBoardId: board.id,
                lastSyncedAt: new Date(),
            },
        });

        return {
            boardId: board.id,
            startDate: lastSyncDate,
            endDate: new Date(),
            syncedPrayerOrdersCount: syncedCount,
        };
    }

    private async syncPrayerOrderStatusUpdates(board: {
        id: number;
        mondayId: string;
        boardName: string | null;
        organizationId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }) {
        // Get current PrayerOrders with status of non-closed
        const nonClosedPrayerOrders = await this.prisma.prayerOrder.findMany({
            where: {
                mondayId: { not: null },
                prayerOrderStatuses: {
                    none: {
                        status: { name: 'Closed' },
                    },
                },
            },
            select: { id: true, mondayId: true },
        });

        if (nonClosedPrayerOrders.length > 0) {
            const mondayIds = nonClosedPrayerOrders
                .map((po) => parseInt(po.mondayId!))
                .filter((id) => !isNaN(id));
            const currentItems =
                await this.mondayService.getItemsById(mondayIds);

            // Get status labels
            const statusLabels = await this.mondayService.getStatusLabels([
                Number(board.mondayId),
            ]);

            await this.prisma.$transaction(async (tx) => {
                for (const item of currentItems) {
                    const prayerOrder = nonClosedPrayerOrders.find(
                        (po) => po.mondayId === item.id
                    );
                    if (!prayerOrder) continue;

                    // Find status column
                    const statusColumn = item.column_values.find(
                        (cv: ColumnValue) => cv.id === 'status'
                    ); // Assuming column id is 'status'
                    if (!statusColumn) continue;

                    const statusId = parseInt(statusColumn.value);
                    const mondayLabel =
                        statusLabels[board.mondayId.toString()]?.[statusId];
                    if (!mondayLabel) continue;

                    const dbStatusName =
                        this.translateMondayStatus(mondayLabel);
                    if (!dbStatusName) continue;

                    // Clear existing statuses and add new one
                    await tx.prayerOrderStatus.deleteMany({
                        where: { prayerOrderId: prayerOrder.id },
                    });
                    const status = await tx.status.findFirst({
                        where: { name: dbStatusName },
                    });
                    if (status) {
                        await tx.prayerOrderStatus.create({
                            data: {
                                prayerOrderId: prayerOrder.id,
                                statusId: status.id,
                            },
                        });
                    }
                }
            });
        }
    }

    private async createPrayerOrders(
        items: Item[],
        creationLogs: ActivityLog[],
        board: {
            id: number;
            mondayId: string;
            boardName: string | null;
            organizationId: number | null;
            createdAt: Date;
            updatedAt: Date;
        }
    ) {
        let syncedCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                const existing = await tx.prayerOrder.findFirst({
                    where: { mondayId: item.id },
                });
                if (existing) continue;

                // Creator is from the activity log user_id
                // Actually, creationLogs have user_id, which is monday user id.
                const log = creationLogs.find((l) => l.data.includes(item.id));
                if (!log) continue;
                const creatorUser = await tx.user.findFirst({
                    where: { mondayId: log.user_id },
                });
                if (!creatorUser) {
                    console.log(
                        'Skipping PrayerOrder creation: creator not found for mondayId:',
                        log.user_id
                    );
                    continue;
                }

                // Get board mapping for intercession type
                const boardMapping = await tx.boardMapping.findFirst({
                    where: { mondayBoardId: board.id },
                });
                if (!boardMapping) {
                    throw new Error(
                        `No BoardMapping found for board ${board.id}`
                    );
                }

                if (!board.organizationId) {
                    throw new Error(
                        `Cannot create PrayerOrder: board ${board.id} has no associated organization`
                    );
                }

                try {
                    await tx.prayerOrder.create({
                        data: {
                            creatorId: creatorUser.id,
                            typeId: boardMapping.intercessionTypeId,
                            organizationId: board.organizationId,
                            title: item.name,
                            firstMessageContent: item.name,
                            mondayId: item.id,
                            createdAt: new Date(
                                Math.floor(Number(log.created_at) / 10000)
                            ),
                        },
                    });
                } catch (e) {
                    console.error('Failed creating PrayerOrder for log:', log);
                    throw e;
                }
                syncedCount++;
            }
        });
        return syncedCount;
    }

    private translateMondayStatus(mondayLabel: string): string | null {
        switch (mondayLabel.toLowerCase()) {
            case 'closed':
            case 'fulfilled':
                return 'Closed';
            case 'ongoing':
                return 'Ongoing';
            case 'paused':
                return 'Paused';
            case 'urgent':
            case 'critical':
                return 'Urgent';
            case 'reviewed':
            case 'reviewed prophecy':
                return 'Reviewed';
            default:
                console.warn(`Unknown monday status: ${mondayLabel}`);
                return null;
        }
    }

    async getAllMondayBoards(): Promise<Array<MondayBoard>> {
        return this.prisma.mondayBoard.findMany();
    }
}
