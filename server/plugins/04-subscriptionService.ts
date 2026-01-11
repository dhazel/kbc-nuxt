import { SubscriptionService } from '../services/SubscriptionService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.subscriptionService = new SubscriptionService(
            event.context.prisma
        );
    });
});
