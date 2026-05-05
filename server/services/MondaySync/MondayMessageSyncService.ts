import { MondayBoard, PrismaClient, ReactionType, SyncType } from '@prisma/client';
import type { IMondaySyncService } from './IMondaySyncService';
import type {
    IMondayService,
} from '../Monday/IMondayService';
import type { IIntercessorReportService } from '../IntercessorReport/IIntercessorReportService';

export class MondayMessageSyncService implements IMondaySyncService {
    constructor(
        private mondayService: IMondayService,
        private prisma: PrismaClient,
        private intercessorReportService: IIntercessorReportService
    ) {}

    /**
     * Sync data from Monday
     */
    async sync(): Promise<void> {
        const startDate: Date = await this.getStartDate();
        const endDate: Date = new Date();

        console.log(`Last message sync date: ${startDate}`);

        console.log('Syncing PrayerOrder messages from start date: ', startDate);
        await this.syncPrayerOrderMessages(startDate, endDate);

        await this.saveThisRunDate();

        console.log('Done syncing messages');
    }

    async saveThisRunDate() {
        try {
            await this.prisma.generalSync.create({
                data: {
                    syncType: SyncType.MondayMessages,
                    lastSyncedAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error saving sync date:', error);
        }
    }

    async getStartDate(): Promise<Date> {
        try {
            const lastSync = (await this.prisma.generalSync.findFirst({
                where: { syncType: SyncType.MondayMessages },
                orderBy: { lastSyncedAt: 'desc' },
            }))?.lastSyncedAt || new Date(2024, 0, 1);

            const prayerActivity = await this.intercessorReportService.getPrayerActivity(
                lastSync,
                new Date()
            );

            if (prayerActivity.items.length > 0) {
                const earliestCreated = prayerActivity.items
                    .map(item => item.created_at)
                    .reduce((min, curr) => curr < min ? curr : min);
                return new Date(earliestCreated);
            }

            return lastSync;
        } catch (error) {
            console.error('Error getting start date:', error);
            return new Date(2024, 0, 1);
        }
    }

    async syncPrayerOrderMessages(
        startDate: Date,
        endDate: Date
    ): Promise<void> {
        const itemUpdates = await this.mondayService.getAllItemMessages(
            startDate,
            endDate
        );
        console.log('Message count:', itemUpdates.length);

        const batches = this.chunkArray(itemUpdates, 30);
        console.log('Batch count:', batches.length);

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

        await this.syncReactions(tx, message.id, item.reactions);

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

    private readonly reactionTypeMap: Record<string, ReactionType> = {
        '+1': ReactionType.LIKE,
        heart: ReactionType.LOVE,
        pray: ReactionType.PRAY,
        laugh: ReactionType.LAUGH,
        care: ReactionType.CARE,
        clap: ReactionType.CLAP,
        celebrate: ReactionType.CELEBRATE,
        rolling_on_the_floor_laughing: ReactionType.LAUGH,
        joy: ReactionType.CELEBRATE,
        smiley: ReactionType.LIKE,
        slightly_smiling_face: ReactionType.LIKE,
        slightly_frowning_face: ReactionType.CARE,
        raised_hands: ReactionType.CELEBRATE,
    };

    private async syncReactions(
        tx: any,
        messageId: number,
        newReactions: any[]
    ): Promise<void> {
        const currentReactions = await tx.messageReaction.findMany({
            where: { messageId },
            select: { id: true, userId: true },
        });
        const newUserIds = new Set<number>();

        for (const reaction of newReactions) {
            if (reaction.reactionType === null) continue;

            const user = await tx.user.findFirst({
                where: { mondayId: reaction.userMondayId },
            });
            if (!user) continue;

            const mappedType = this.reactionTypeMap[reaction.reactionType];
            if (!mappedType) {
                console.warn(
                    `Skipping unknown reaction type, '${reaction.reactionType}', on Message Id, ${messageId}`
                );
                continue;
            }

            newUserIds.add(user.id);
            await tx.messageReaction.upsert({
                where: {
                    messageId_userId: {
                        messageId,
                        userId: user.id,
                    },
                },
                update: {
                    reactionType: mappedType,
                },
                create: {
                    messageId,
                    userId: user.id,
                    reactionType: mappedType,
                },
            });
        }

        for (const current of currentReactions) {
            if (!newUserIds.has(current.userId)) {
                await tx.messageReaction.delete({
                    where: { id: current.id },
                });
            }
        }
    }

    async getAllMondayBoards(): Promise<Array<MondayBoard>> {
        return this.prisma.mondayBoard.findMany();
    }
}
