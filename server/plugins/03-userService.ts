import { UserService } from '../services/UserService';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        event.context.userService = new UserService(event.context.prisma);
    });
});
