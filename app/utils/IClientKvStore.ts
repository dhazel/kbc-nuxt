export interface IClientKvStore {
  getItem(key: string): Promise<any | null>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  getKeys(): Promise<string[]>;
  clear(): Promise<void>;
  hasItem(key: string): Promise<boolean>;
}

