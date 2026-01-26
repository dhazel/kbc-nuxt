import { IntercessionTypeService } from '../services/IntercessionTypeService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.intercessionTypeService = new IntercessionTypeService(
            event.context.prisma
        );
    });
});
