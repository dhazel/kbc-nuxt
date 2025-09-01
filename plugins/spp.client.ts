import { SppService } from '~/utilities/SppService';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const spp = new SppService(headers);

    spp.setStorage(nuxtApp.$clientKv);

    nuxtApp.provide('spp', spp);
});
