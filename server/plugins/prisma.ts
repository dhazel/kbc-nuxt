import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineNitroPlugin(async (nitroApp) => {
    // Attach Prisma client to H3 event context
    nitroApp.hooks.hook('request', (event) => {
        event.context.prisma = prisma;
    });
});
