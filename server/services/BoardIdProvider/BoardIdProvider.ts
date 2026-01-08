import type { IBoardIdProvider } from './IBoardIdProvider';
import type { PrismaClient } from '@prisma/client';

export class BoardIdProvider implements IBoardIdProvider {
    constructor(private prisma: PrismaClient) {}

    async getBoardIds(
        subscriptionType: 'month-to-month' | 'annual',
        prayerOrderType: 'informed' | 'inspired'
    ): Promise<number[]> {
        const boardMappings = await this.prisma.boardMapping.findMany({
            where: {
                subscription: {
                    name: {
                        startsWith: subscriptionType,
                        mode: 'insensitive',
                    },
                },
                threadType: {
                    name: {
                        contains: prayerOrderType,
                        mode: 'insensitive',
                    },
                },
            },
            select: {
                mondayBoardId: true,
            },
        });

        return boardMappings.map((mapping: { mondayBoardId: bigint }) =>
            Number(mapping.mondayBoardId)
        );
    }
}
