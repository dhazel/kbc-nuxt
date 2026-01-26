import type { PrismaClient } from '@prisma/client';
import type { IMondaySyncService } from './IMondaySyncService';
import type { IMondayService } from '../Monday/IMondayService';

export class MondayBoardNameSyncService implements IMondaySyncService {
    constructor(
        private mondayService: IMondayService,
        private prisma: PrismaClient
    ) {}

    /**
     * Sync data from Monday
     */
    async sync(): Promise<void> {
        // get all board numbers from the database
        const dbBoards = await this.prisma.mondayBoard.findMany({
            select: { mondayBoardId: true },
        });
        const boardIds = dbBoards.map((b) => Number(b.mondayBoardId));

        // get the name of each board from Monday
        const mondayBoards = await this.mondayService.getBoards(boardIds);
        const boardMap = new Map(mondayBoards.map((b) => [b.mondayId, b]));

        // update each board record in the database with its name from Monday
        await this.prisma.$transaction(async (tx) => {
            for (const dbBoard of dbBoards) {
                const boardId = Number(dbBoard.mondayBoardId);
                const mondayBoard = boardMap.get(boardId);
                if (
                    mondayBoard &&
                    mondayBoard.name &&
                    mondayBoard.name.trim() !== ''
                ) {
                    await tx.mondayBoard.update({
                        where: { mondayBoardId: dbBoard.mondayBoardId },
                        data: { boardName: mondayBoard.name },
                    });
                }
            }
        });
    }
}
