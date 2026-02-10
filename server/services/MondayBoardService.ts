import type { PrismaClient } from '@prisma/client';
import type { IMondayBoardService } from '../../app/utils/IMondayBoardService';
import type { MondayBoardDTO } from '../../app/utils/BoardMappingDTOs';

export class MondayBoardService implements IMondayBoardService {
    constructor(private prisma: PrismaClient) {}

    async getAllMondayBoards(): Promise<MondayBoardDTO[]> {
        const results = await this.prisma.mondayBoard.findMany();
        return results.map((mb) => this.mapToMondayBoardDTO(mb));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToMondayBoardDTO(mb: any): MondayBoardDTO {
        return {
            id: mb.id,
            mondayId: mb.mondayId,
            boardName: mb.boardName,
            organizationId: mb.organizationId,
            createdAt: mb.createdAt,
            updatedAt: mb.updatedAt,
        };
    }
}
