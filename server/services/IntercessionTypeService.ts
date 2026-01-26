import type { PrismaClient } from '@prisma/client';
import type { IIntercessionTypeService } from '../../app/utils/IIntercessionTypeService';

export class IntercessionTypeService implements IIntercessionTypeService {
    constructor(private prisma: PrismaClient) {}

    async getAllIntercessionTypes() {
        return this.prisma.intercessionType.findMany();
    }
}
