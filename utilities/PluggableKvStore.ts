import { createStorage, type Storage } from 'unstorage';
import type { IKvStore } from './IKvStore';

export class PluggableKvStore implements IKvStore {
  private storage: Storage;

  constructor(driver: any) {
    this.storage = createStorage({ driver });
  }

  async get(key: string): Promise<string | null> {
    const value = await this.storage.getItem(key);
    return typeof value === 'string' ? value : null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.storage.setItem(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }
}
