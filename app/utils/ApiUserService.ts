import type { IUserService } from './IUserService';
import type { UserProfile } from './UserProfile';

export class ApiUserService implements IUserService {
    async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
        try {
            const response = await fetch(
                `/api/user/${encodeURIComponent(email)}`
            );
            if (response.ok) {
                return await response.json();
            } else if (response.status === 404) {
                return null;
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Failed to get user profile:', error);
            return null;
        }
    }

    async saveUserProfile(profile: UserProfile): Promise<boolean> {
        try {
            const response = await fetch(
                `/api/user/${encodeURIComponent(profile.email)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile),
                }
            );
            return response.ok;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            return false;
        }
    }
}
