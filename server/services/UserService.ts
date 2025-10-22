import type { DataSource } from 'typeorm';
import type { IUserService } from '../../utilities/IUserService';
import type { UserProfile } from '../../utilities/UserKvService';
import { User } from '../entities/User';

export class UserService implements IUserService {
    constructor(private db: DataSource) {}

    async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
        try {
            const userRepo = this.db.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });
            if (user) {
                return {
                    email: user.email,
                    joinedAt: user.joinedAt,
                    name: user.name,
                    prayerOrders: user.prayerOrders,
                    prayerResponses: user.prayerResponses,
                    visitCount: user.visitCount,
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
            const userRepo = this.db.getRepository(User);
            let user = await userRepo.findOne({
                where: { email: profile.email },
            });
            if (user) {
                user.name = profile.name;
                user.prayerOrders = profile.prayerOrders;
                user.prayerResponses = profile.prayerResponses;
                user.visitCount = profile.visitCount;
                await userRepo.save(user);
            } else {
                user = userRepo.create({
                    email: profile.email,
                    name: profile.name,
                    prayerOrders: profile.prayerOrders,
                    prayerResponses: profile.prayerResponses,
                    visitCount: profile.visitCount,
                    joinedAt: profile.joinedAt,
                });
                await userRepo.save(user);
            }
            return true;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            return false;
        }
    }
}
