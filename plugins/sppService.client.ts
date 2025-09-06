import { SppService } from '~/utilities/SppService';
import { SppKvService } from '~/utilities/SppKvService';
import { IndexedDbStorage } from '~/utilities/IndexedDbStorage';
import type { IClientKvStore } from '~/utilities/IClientKvStore';

export default defineNuxtPlugin((nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);

    // Check environment variable to determine which service to use
    const config = useRuntimeConfig();
    const serviceType = config.public.NUXT_SPPSERVICE_TYPE || 'monday';

    let sppService;
    switch (serviceType) {
        case 'kv':
            // Use KV-based service with server-side storage
            sppService = new SppKvService(nuxtApp.$kv as IClientKvStore);
            break;
        case 'indexeddb':
            // Use KV-based service with IndexedDB storage
            const indexedDbStore = new IndexedDbStorage();
            sppService = new SppKvService(indexedDbStore);
            break;
        case 'monday':
            // Default: use Monday.com API service
            sppService = new SppService(headers, nuxtApp.$kv as IClientKvStore);
            break;
        default:
            throw Error(`Unknown spp service type: ${serviceType}`);
            break;
    } 


    nuxtApp.provide('sppService', sppService);
});
