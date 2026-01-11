import { BoardMappingService } from '../services/BoardMappingService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.boardMappingService = new BoardMappingService(
            event.context.prisma
        );
    });
});
