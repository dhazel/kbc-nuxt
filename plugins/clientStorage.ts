import { ClientStorage } from '~/utilities/ClientStorage';

export default defineNuxtPlugin((nuxtApp) => {
  const clientStorage = new ClientStorage();
  nuxtApp.provide('clientKv', clientStorage);
});