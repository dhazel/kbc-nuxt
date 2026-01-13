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
                const existing = await this.prisma.user.findFirst({
                    where: { email: user.email },
                });
                if (existing) {
                    // Update existing user
                    const updateData: { name: string; mondayId?: string } = {
                        name: user.name,
                    };
                    if (!existing.mondayId) {
                        updateData.mondayId = user.mondayId;
                    }
                    await this.prisma.user.update({
                        where: { id: existing.id },
                        data: updateData,
                    });
                } else {
                    // Upsert new user
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
                }
            } catch (error) {
                console.error('Failed to sync user:', user, error);
            }
        }
    }
}
