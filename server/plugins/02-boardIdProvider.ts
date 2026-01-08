import { BoardIdProvider } from '../services/BoardIdProvider/BoardIdProvider';

export default defineNitroPlugin(async (nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        const prisma = event.context.prisma;
        event.context.boardIdProvider = new BoardIdProvider(prisma);
    });
});
