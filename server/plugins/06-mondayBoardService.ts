import { MondayBoardService } from '../services/MondayBoardService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.mondayBoardService = new MondayBoardService(
            event.context.prisma
        );
    });
});
