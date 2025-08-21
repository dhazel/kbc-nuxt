import { getStore } from "@netlify/blobs";
import type { Driver } from 'unstorage';

export const netlifyDriver = (): Driver => {
  const store = getStore({
    name: process.env.NETLIFY_BLOB_STORE_NAME!,
    siteID: process.env.NETLIFY_SITE_ID!,
    token: process.env.NETLIFY_TOKEN!,
  });

  return {
    name: 'netlify',
    options: {},
    async hasItem(key: string) {
      const item = await store.get(key);
      return item !== null;
    },
    async getItem(key: string) {
      return store.get(key);
    },
    async setItem(key: string, value: string) {
      await store.set(key, value);
    },
    async removeItem(key: string) {
      await store.delete(key);
    },
    async getKeys() {
      // Implement if needed, for now return empty array
      return [];
    },
    async clear() {
      // Implement if needed
    },
    async dispose() {
      // Cleanup if needed
    }
  };
};
