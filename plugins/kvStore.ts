import { NetlifyKvStore } from '~/utilities/NetlifyKvStore';
import type { KvStore } from '~/utilities/KvStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let kv: KvStore;
  switch (config.kvBackend) {
    case 'netlify':
      kv = new NetlifyKvStore();
      break;
    default:
      throw new Error(`Unknown KV backend: ${config.kvBackend}`);
  }
  nuxtApp.provide('kv', kv);
});