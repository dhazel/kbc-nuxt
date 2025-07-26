import { SppConnection } from '~/utilities/SppConnection';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const spp = new SppConnection(headers);
    nuxtApp.provide('spp', spp);
});
