import type { IClientKvStore } from "./IClientKvStore";
import type { ISppService } from "./ISppService";

export class SppKvService implements ISppService {
  constructor(private kvStore: IClientKvStore) {}

  async addPrayerOrderForInformedIntercession(user: User, prayerOrder: PrayerOrder): Promise<void> {
    throw new Error('Not implemented in SppKvService');
  }

  async getInformedIntercessionGroup(user: User): Promise<any> {
    throw new Error('Not implemented in SppKvService');
  }

  async addInformedIntercessionGroup(user: User): Promise<any> {
    throw new Error('Not implemented in SppKvService');
  }

  async getBoard(name: string): Promise<any> {
    throw new Error('Not implemented in SppKvService');
  }
}

// Re-export interfaces for convenience
export type { ISppService } from "./ISppService";

