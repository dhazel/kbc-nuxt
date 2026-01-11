import type { PrismaClient } from '@prisma/client';
import type { IThreadTypeService } from '../../app/utils/IThreadTypeService';

export class ThreadTypeService implements IThreadTypeService {
    constructor(private prisma: PrismaClient) {}

    async getAllThreadTypes() {
        return this.prisma.threadType.findMany();
    }
}
