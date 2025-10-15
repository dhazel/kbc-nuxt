import type { IClientKvStore } from './IClientKvStore';

export interface UserProfile {
    email: string;
    joinedAt: Date;
    name: string;
    prayerOrders: number;
    prayerResponses: number;
    visitCount: number;
}

export class UserService {
    private currentUserEmail: string | null = null;

    constructor(private kvStore: IClientKvStore) {}

    /**
     * Set the current authenticated user
     * @param user - Kinde user object
     */
    setCurrentUser(user: any): void {
        this.currentUserEmail = user?.email || null;
    }

    /**
     * Clear the current user (logout)
     */
    clearCurrentUser(): void {
        this.currentUserEmail = null;
    }

    /**
     * Get the current user ID
     * @returns string | null
     */
    getCurrentUserEmail(): string | null {
        return this.currentUserEmail;
    }

    /**
     * Get current user's profile
     * @returns Promise<UserProfile | null>
     */
    async getCurrentUserProfile(): Promise<UserProfile | null> {
        if (!this.currentUserEmail) {
            console.warn('No current user set');
            return null;
        }
        return this.getUserProfileByEmail(this.currentUserEmail);
    }

    /**
     * Save current user's profile
     * @param profile - User profile data
     * @returns Promise<boolean> - Success status
     */
    async saveCurrentUserProfile(profile: UserProfile): Promise<boolean> {
        if (!this.currentUserEmail) {
            console.warn('No current user set');
            return false;
        }
        return this.saveUserProfile(this.currentUserEmail, profile);
    }

    /**
     * Get or create current user's profile
     * @returns Promise<UserProfile | null>
     */
    async getOrCreateCurrentUserProfile(): Promise<UserProfile | null> {
        if (!this.currentUserEmail) {
            console.warn('No current user set');
            return null;
        }
        return this.getOrCreateUserProfile(this.currentUserEmail);
    }

    /**
     * Get user profile from KV store
     * @param userEmail - User's unique identifier (email)
     * @returns Promise<UserProfile | null>
     */
    async getUserProfileByEmail(userEmail: string): Promise<UserProfile | null> {
        try {
            const userKey = `user:${userEmail}`;
            const profileData = await this.kvStore.getItem(userKey);

            if (profileData) {
                const parsed = profileData as any;
                return {
                    email: userEmail,
                    joinedAt: new Date(parsed.joinedAt),
                    name: parsed.name,
                    prayerOrders: parsed.prayerOrders,
                    prayerResponses: parsed.prayerResponses,
                    visitCount: parsed.visitCount,
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
    async saveUserProfile(
        userEmail: string,
        profile: UserProfile
    ): Promise<boolean> {
        try {
            const userKey = `user:${userEmail}`;
            await this.kvStore.setItem(userKey, JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            return false;
        }
    }

    /**
     * Create a new default user profile
     * @returns UserProfile
     */
    makeDefaultProfile(): UserProfile {
        return {
            email: '', //TODO: fix email and name, this is currently broken
            joinedAt: new Date(),
            name: '',
            prayerOrders: 0,
            prayerResponses: 0,
            visitCount: 0,
        };
    }

    /**
     * Get or create user profile - main method for user enhancement
     * @param userEmail - User's unique identifier (email)
     * @returns Promise<UserProfile>
     */
    async getOrCreateUserProfile(userEmail: string): Promise<UserProfile> {
        // Try to get existing profile
        const existingProfile = await this.getUserProfileByEmail(userEmail);

        if (existingProfile) {
            console.log('User profile loaded from KV store:', existingProfile);
            return existingProfile;
        }

        // Create new profile if none exists
        const newProfile = this.makeDefaultProfile();
        const saved = await this.saveUserProfile(userEmail, newProfile);

        if (saved) {
            console.log('New user profile created and stored:', newProfile);
        } else {
            console.error('Failed to save new user profile');
        }

        return newProfile;
    }
}
