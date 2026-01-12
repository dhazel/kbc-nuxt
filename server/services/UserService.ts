import type { PrismaClient } from '@prisma/client';
import type { IUserService } from '../../app/utils/IUserService';
import type { UserProfile } from '../../app/utils/UserKvService';

export class UserService implements IUserService {
    constructor(private prisma: PrismaClient) {}

    async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: { roles: true },
            });
            if (user) {
                return {
                    email: user.email,
                    joinedAt: user.joinedAt,
                    name: user.name,
                    visitCount: user.visitCount,
                    roles: user.roles.map((role) => role.name),
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to get user profile:', error);
            return null;
        }
    }

    async saveUserProfile(profile: UserProfile): Promise<boolean> {
        try {
            await this.prisma.user.upsert({
                where: { email: profile.email },
                update: {
                    name: profile.name,
                    visitCount: profile.visitCount,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    visitCount: profile.visitCount,
                    joinedAt: profile.joinedAt,
                },
            });
            return true;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            return false;
        }
    }
}
