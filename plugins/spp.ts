import mondaySdk from "monday-sdk-js";
import { SppConnection } from '~/utilities/sppConnection.ts';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const monday = mondaySdk();
  monday.setToken(config.mondayToken); // Use config.public.mondayToken if public

  const spp = new SppConnection(monday);
  nuxtApp.provide('spp', spp);
});
