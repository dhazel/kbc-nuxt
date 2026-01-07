import { ClientKvStorage } from '~/utils/ClientKvStorage';

export default defineNuxtPlugin((nuxtApp) => {
  const clientStorage = new ClientKvStorage();
  nuxtApp.provide('kv', clientStorage);
});
