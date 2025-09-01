import { SppService } from '~/utilities/SppService';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);

    const spp = new SppService(headers, nuxtApp.$kv);

    nuxtApp.provide('sppService', spp);
});
