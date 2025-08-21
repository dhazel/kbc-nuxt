import { PluggableKvStore } from '~/utilities/PluggableKvStore';
import { netlifyDriver } from '~/utilities/NetlifyKvStore';
import type { IKvStore } from '~/utilities/PluggableKvStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let kv: IKvStore;
  switch (config.kvBackend) {
    case 'netlify':
      kv = new PluggableKvStore(netlifyDriver());
      break;
    default:
      throw new Error(`Unknown KV backend: ${config.kvBackend}`);
  }
  nuxtApp.provide('kv', kv);
});
