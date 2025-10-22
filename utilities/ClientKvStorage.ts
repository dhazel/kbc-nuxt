import type { IClientKvStore } from "./IClientKvStore";

export class ClientKvStorage implements IClientKvStore {
  async hasItem(key: string): Promise<boolean> {
    try {
      const response = await $fetch<{ value: string | null }>('/api/kvstorage/get', {
        method: 'POST',
        body: { key }
      });
      return response.value !== null;
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const response = await $fetch<{ value: string | null }>('/api/kvstorage/get', {
        method: 'POST',
        body: { key }
      });
      return response.value;
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await $fetch('/api/kvstorage/set', {
        method: 'POST',
        body: { key, value }
      });
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await $fetch('/api/kvstorage/remove', {
        method: 'POST',
        body: { key }
      });
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async getKeys(): Promise<string[]> {
    try {
      const response = await $fetch<{ keys: string[] }>('/api/kvstorage/keys', {
        method: 'POST',
        body: {}
      });
      return response.keys;
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await $fetch('/api/kvstorage/clear', {
        method: 'POST',
        body: {}
      });
    } catch (error: any) {
      if (error.statusCode === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }
}
