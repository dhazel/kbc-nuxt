import { PrayerOrderType } from '~~/types/prayerOrder';
import type { IBoardIdProvider } from './IBoardIdProvider';
import type { PrismaClient } from '@prisma/client';

export class BoardIdProvider implements IBoardIdProvider {
    constructor(private prisma: PrismaClient) {}

    async getBoardIds(
        prayerOrderType: PrayerOrderType
    ): Promise<number[]> {
        let subscriptionType = '';
        let intercessionType = '';
        switch (prayerOrderType) {
            case PrayerOrderType.annualInformed:
                subscriptionType = 'annual';
                intercessionType = 'informed';
                break;
            case PrayerOrderType.annualInspired:
                subscriptionType = 'annual';
                intercessionType = 'inspired';
                break;
            case PrayerOrderType.monthToMonthInformed:
                subscriptionType = 'month-to-month';
                intercessionType = 'informed';
                break;
            case PrayerOrderType.monthToMonthInspired:
                subscriptionType = 'month-to-month';
                intercessionType = 'inspired';
                break;
            default:
                throw new Error(`Unknown PrayerOrderType: ${prayerOrderType}`);
        }
        const boardMappings = await this.prisma.boardMapping.findMany({
            where: {
                subscription: {
                    name: {
                        startsWith: subscriptionType,
                        mode: 'insensitive',
                    },
                },
                intercessionType: {
                    name: {
                        contains: intercessionType,
                        mode: 'insensitive',
                    },
                },
            },
            select: {
                mondayBoard: {
                    select: {
                        mondayBoardId: true,
                    },
                },
            },
        });

        return boardMappings
            .map(
                (mapping: { mondayBoard: { mondayBoardId: bigint } | null }) =>
                    mapping.mondayBoard
                        ? Number(mapping.mondayBoard.mondayBoardId)
                        : 0
            )
            .filter((id) => id !== 0);
    }
}
