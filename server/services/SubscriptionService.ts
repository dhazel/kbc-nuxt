import type { PrismaClient } from '@prisma/client';
import type { ISubscriptionService } from '../../app/utils/ISubscriptionService';

export class SubscriptionService implements ISubscriptionService {
    constructor(private prisma: PrismaClient) {}

    async getAllSubscriptions() {
        return this.prisma.subscription.findMany();
    }
}
