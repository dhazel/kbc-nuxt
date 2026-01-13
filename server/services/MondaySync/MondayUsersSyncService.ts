import type { PrismaClient } from '@prisma/client';
import type { IMondaySyncService } from './IMondaySyncService';
import type { IMondayService } from '../Monday/IMondayService';

export class MondayUsersSyncService implements IMondaySyncService {
    constructor(
        private mondayService: IMondayService,
        private prisma: PrismaClient
    ) {}

    /**
     * Sync data from Monday
     */
    async sync(): Promise<void> {
        const users = await this.mondayService.getAllMondayUsers();
        for (const user of users) {
            if (!user.mondayId || !user.email) continue;
            try {
                await this.prisma.user.upsert({
                    where: { mondayId: user.mondayId },
                    update: { name: user.name, email: user.email },
                    create: {
                        mondayId: user.mondayId,
                        name: user.name,
                        email: user.email,
                        visitCount: 0,
                    },
                });
            } catch (error) {
                console.error('Failed to sync user:', user.id, error);
            }
        }
    }
}
