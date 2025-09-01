import type { IClientKvStore } from './IClientKvStore'

export interface UserProfile {
  prayerOrders: number
  prayerResponses: number
  joinedAt: string
  visitCount: number
  preferences: Record<string, any>
}

export class UserService {
  private currentUserId: string | null = null

  constructor(private kvStore: IClientKvStore) {}

  /**
   * Set the current authenticated user
   * @param user - Kinde user object
   */
  setCurrentUser(user: any): void {
    this.currentUserId = user?.email || null
  }

  /**
   * Clear the current user (logout)
   */
  clearCurrentUser(): void {
    this.currentUserId = null
  }

  /**
   * Get the current user ID
   * @returns string | null
   */
  getCurrentUserId(): string | null {
    return this.currentUserId
  }

  /**
   * Get current user's profile
   * @returns Promise<UserProfile | null>
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!this.currentUserId) {
      console.warn('No current user set')
      return null
    }
    return this.getUserProfile(this.currentUserId)
  }

  /**
   * Save current user's profile
   * @param profile - User profile data
   * @returns Promise<boolean> - Success status
   */
  async saveCurrentUserProfile(profile: UserProfile): Promise<boolean> {
    if (!this.currentUserId) {
      console.warn('No current user set')
      return false
    }
    return this.saveUserProfile(this.currentUserId, profile)
  }

  /**
   * Get or create current user's profile
   * @returns Promise<UserProfile | null>
   */
  async getOrCreateCurrentUserProfile(): Promise<UserProfile | null> {
    if (!this.currentUserId) {
      console.warn('No current user set')
      return null
    }
    return this.getOrCreateUserProfile(this.currentUserId)
  }

  /**
   * Get user profile from KV store
   * @param userId - User's unique identifier (email)
   * @returns Promise<UserProfile | null>
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userKey = `user:${userId}`
      const profileData = await this.kvStore.getItem(userKey)

      if (profileData) {
        return profileData as UserProfile
      }

      return null
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return null
    }
  }

  /**
   * Save or update user profile in KV store
   * @param userId - User's unique identifier (email)
   * @param profile - User profile data
   * @returns Promise<boolean> - Success status
   */
  async saveUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      const userKey = `user:${userId}`
      await this.kvStore.setItem(userKey, JSON.stringify(profile))
      return true
    } catch (error) {
      console.error('Failed to save user profile:', error)
      return false
    }
  }

  /**
   * Create a new default user profile
   * @returns UserProfile
   */
  makeDefaultProfile(): UserProfile {
    return {
      prayerOrders: 0,
      prayerResponses: 0,
      joinedAt: new Date().toISOString(),
      visitCount: 0,
      preferences: {}
    }
  }

  /**
   * Get or create user profile - main method for user enhancement
   * @param userId - User's unique identifier (email)
   * @returns Promise<UserProfile>
   */
  async getOrCreateUserProfile(userId: string): Promise<UserProfile> {
    // Try to get existing profile
    const existingProfile = await this.getUserProfile(userId)

    if (existingProfile) {
      console.log('User profile loaded from KV store:', existingProfile)
      return existingProfile
    }

    // Create new profile if none exists
    const newProfile = this.makeDefaultProfile()
    const saved = await this.saveUserProfile(userId, newProfile)

    if (saved) {
      console.log('New user profile created and stored:', newProfile)
    } else {
      console.error('Failed to save new user profile')
    }

    return newProfile
  }
}
