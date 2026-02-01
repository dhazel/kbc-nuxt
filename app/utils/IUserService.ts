import type UserProfile from './UserProfile';

export interface IUserService {
  getUserProfileByEmail(userEmail: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<boolean>;
}

