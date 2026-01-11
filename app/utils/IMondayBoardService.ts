import type { MondayBoardDTO } from './BoardMappingDTOs';

export interface IMondayBoardService {
    getAllMondayBoards(): Promise<MondayBoardDTO[]>;
}
