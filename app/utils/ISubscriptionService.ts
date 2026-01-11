import type { Subscription } from '@prisma/client';

export interface ISubscriptionService {
    getAllSubscriptions(): Promise<Subscription[]>;
}
