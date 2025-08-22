export interface IClientKvStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getKeys(): Promise<string[]>;
  clear(): Promise<void>;
  hasItem(key: string): Promise<boolean>;
}

