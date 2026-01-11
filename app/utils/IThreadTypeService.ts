import type { ThreadType } from '@prisma/client';

export interface IThreadTypeService {
    getAllThreadTypes(): Promise<ThreadType[]>;
}
