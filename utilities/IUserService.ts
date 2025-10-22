import type { UserProfile } from "./UserKvService";

export interface IUserService {
  getUserProfileByEmail(userEmail: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<boolean>;
}

