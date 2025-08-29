import { SppService } from '~/utilities/SppService';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const spp = new SppService(headers);

    // If we're on the client side and client storage is available, enhance the spp instance
    if (import.meta.client && nuxtApp.$clientKv) {
        spp.setStorage(nuxtApp.$clientKv);
    }

    nuxtApp.provide('spp', spp);
});
