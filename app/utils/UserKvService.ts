import type { IClientKvStore } from './IClientKvStore';
import type { IUserService } from './IUserService';

export interface UserProfile {
    email: string;
    joinedAt: Date;
    name: string;
    visitCount: number;
    roles: string[];
}

export class UserKvService implements IUserService {
    constructor(private kvStore: IClientKvStore) {}

    /**
     * Get user profile from KV store
     * @param userEmail - User's unique identifier (email)
     * @returns Promise<UserProfile | null>
     */
    async getUserProfileByEmail(
        userEmail: string
    ): Promise<UserProfile | null> {
        try {
            const userKey = `user:${userEmail}`;
            const profileData = await this.kvStore.getItem(userKey);

            if (profileData) {
                const parsed = profileData as any;
                return {
                    email: userEmail,
                    joinedAt: new Date(parsed.joinedAt),
                    name: parsed.name,
                    visitCount: parsed.visitCount,
                    roles: parsed.roles || [],
                };
            }

            return null;
        } catch (error) {
            console.error('Failed to get user profile:', error);
            return null;
        }
    }

    /**
     * Save or update user profile in KV store
     * @param userEmail - User's unique identifier (email)
     * @param profile - User profile data
     * @returns Promise<boolean> - Success status
     */
    async saveUserProfile(profile: UserProfile): Promise<boolean> {
        try {
            const userKey = `user:${profile.email}`;
            await this.kvStore.setItem(userKey, JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            return false;
        }
    }
}
