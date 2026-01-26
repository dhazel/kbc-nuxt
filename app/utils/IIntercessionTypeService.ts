import type { IntercessionType } from '@prisma/client';

export interface IIntercessionTypeService {
    getAllIntercessionTypes(): Promise<IntercessionType[]>;
}
