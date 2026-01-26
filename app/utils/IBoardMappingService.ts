import type { BoardMappingDTO } from './BoardMappingDTOs';

export interface IBoardMappingService {
    getAllBoardMappings(): Promise<BoardMappingDTO[]>;
    getBoardMappingById(id: number): Promise<BoardMappingDTO | null>;
    createBoardMapping(data: {
        subscriptionId: number;
        intercessionTypeId: number;
        mondayBoardId?: number;
    }): Promise<BoardMappingDTO>;
    updateBoardMapping(
        id: number,
        data: {
            subscriptionId?: number;
            intercessionTypeId?: number;
            mondayBoardId?: number;
        }
    ): Promise<BoardMappingDTO>;
    deleteBoardMapping(id: number): Promise<void>;
}
