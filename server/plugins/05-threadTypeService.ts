import { ThreadTypeService } from '../services/ThreadTypeService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.threadTypeService = new ThreadTypeService(
            event.context.prisma
        );
    });
});
