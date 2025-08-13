import { getStore } from "@netlify/blobs";

import type { KvStore } from "./KvStore";

export class NetlifyKvStore implements KvStore {
  private store;

  constructor() {
    this.store = getStore({
      name: process.env.NETLIFY_BLOB_STORE_NAME!,
      siteID: process.env.NETLIFY_SITE_ID!,
      token: process.env.NETLIFY_TOKEN!,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key);
  }
}
