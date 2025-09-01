import type { IClientKvStore } from "./IClientKvStore";

export interface ISppService {
  addPrayerOrderForInformedIntercession(user: User, prayerOrder: PrayerOrder): Promise<void>;
  getInformedIntercessionGroup(user: User): Promise<any>;
  addInformedIntercessionGroup(user: User): Promise<any>;
  getBoard(name: string): Promise<any>;
}

