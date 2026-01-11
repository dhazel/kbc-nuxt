import type { PrismaClient } from '@prisma/client';
import type { IBoardMappingService } from '../../app/utils/IBoardMappingService';
import type {
    BoardMappingDTO,
    SubscriptionDTO,
    ThreadTypeDTO,
    MondayBoardDTO,
} from '../../app/utils/BoardMappingDTOs';

export class BoardMappingService implements IBoardMappingService {
    constructor(private prisma: PrismaClient) {}

    async getAllBoardMappings(): Promise<BoardMappingDTO[]> {
        const results = await this.prisma.boardMapping.findMany({
            include: {
                subscription: true,
                threadType: true,
                mondayBoard: true,
            },
        });
        return results.map((bm) => this.mapToBoardMappingDTO(bm));
    }

    async getBoardMappingById(id: number): Promise<BoardMappingDTO | null> {
        const result = await this.prisma.boardMapping.findUnique({
            where: { id },
            include: {
                subscription: true,
                threadType: true,
                mondayBoard: true,
            },
        });
        return result ? this.mapToBoardMappingDTO(result) : null;
    }

    async createBoardMapping(data: {
        subscriptionId: number;
        threadTypeId: number;
        mondayBoardId?: number;
    }) {
        // Validate foreign keys
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: data.subscriptionId },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }

        const threadType = await this.prisma.threadType.findUnique({
            where: { id: data.threadTypeId },
        });
        if (!threadType) {
            throw new Error('ThreadType not found');
        }

        if (data.mondayBoardId) {
            const mondayBoard = await this.prisma.mondayBoard.findUnique({
                where: { id: data.mondayBoardId },
            });
            if (!mondayBoard) {
                throw new Error('MondayBoard not found');
            }
        }

        const result = await this.prisma.boardMapping.create({
            data,
            include: {
                subscription: true,
                threadType: true,
                mondayBoard: true,
            },
        });
        return this.mapToBoardMappingDTO(result);
    }

    async updateBoardMapping(
        id: number,
        data: {
            subscriptionId?: number;
            threadTypeId?: number;
            mondayBoardId?: number;
        }
    ) {
        // Check if mapping exists
        const existing = await this.prisma.boardMapping.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new Error('BoardMapping not found');
        }

        // Validate foreign keys if provided
        if (data.subscriptionId) {
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: data.subscriptionId },
            });
            if (!subscription) {
                throw new Error('Subscription not found');
            }
        }

        if (data.threadTypeId) {
            const threadType = await this.prisma.threadType.findUnique({
                where: { id: data.threadTypeId },
            });
            if (!threadType) {
                throw new Error('ThreadType not found');
            }
        }

        if (data.mondayBoardId !== undefined) {
            if (data.mondayBoardId) {
                const mondayBoard = await this.prisma.mondayBoard.findUnique({
                    where: { id: data.mondayBoardId },
                });
                if (!mondayBoard) {
                    throw new Error('MondayBoard not found');
                }
            }
        }

        const result = await this.prisma.boardMapping.update({
            where: { id },
            data,
            include: {
                subscription: true,
                threadType: true,
                mondayBoard: true,
            },
        });
        return this.mapToBoardMappingDTO(result);
    }

    async deleteBoardMapping(id: number): Promise<void> {
        // Check if mapping exists
        const existing = await this.prisma.boardMapping.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new Error('BoardMapping not found');
        }

        await this.prisma.boardMapping.delete({
            where: { id },
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToSubscriptionDTO(sub: any): SubscriptionDTO {
        return {
            id: sub.id,
            name: sub.name,
            description: sub.description,
            createdAt: sub.createdAt,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToThreadTypeDTO(tt: any): ThreadTypeDTO {
        return {
            id: tt.id,
            name: tt.name,
            description: tt.description,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToMondayBoardDTO(mb: any): MondayBoardDTO {
        return {
            id: mb.id,
            mondayBoardId: mb.mondayBoardId.toString(),
            boardName: mb.boardName,
            organizationId: mb.organizationId,
            createdAt: mb.createdAt,
            updatedAt: mb.updatedAt,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToBoardMappingDTO(bm: any): BoardMappingDTO {
        return {
            id: bm.id,
            subscriptionId: bm.subscriptionId,
            subscription: this.mapToSubscriptionDTO(bm.subscription),
            threadTypeId: bm.threadTypeId,
            threadType: this.mapToThreadTypeDTO(bm.threadType),
            mondayBoardId: bm.mondayBoardId,
            mondayBoard: bm.mondayBoard
                ? this.mapToMondayBoardDTO(bm.mondayBoard)
                : null,
        };
    }
}
