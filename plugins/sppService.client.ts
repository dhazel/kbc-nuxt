import { SppService } from '~/utilities/SppService';
import { SppKvService } from '~/utilities/SppKvService';
import type { IClientKvStore } from '~/utilities/IClientKvStore';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);

    // Check environment variable to determine which service to use
    const useKvService = process.env.NUXT_USE_KV_SERVICE === 'true';

    let sppService;
    if (useKvService) {
        // Use KV-based service
        sppService = new SppKvService(nuxtApp.$kv as IClientKvStore);
    } else {
        // Use default Monday.com API service
        sppService = new SppService(headers, nuxtApp.$kv as IClientKvStore);
    }

    nuxtApp.provide('sppService', sppService);
});
