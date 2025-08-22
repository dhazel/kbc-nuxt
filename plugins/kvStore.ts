import { createStorage, type Storage } from 'unstorage';
import { netlifyDriver } from '~/utilities/NetlifyKvStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let storage: Storage;
  switch (config.kvBackend) {
    case 'netlify':
      storage = createStorage({ driver: netlifyDriver() });
      break;
    default:
      throw new Error(`Unknown KV backend: ${config.kvBackend}`);
  }
  nuxtApp.provide('kv', storage);
});
