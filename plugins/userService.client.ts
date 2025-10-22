import { UserService, type UserProfile } from '~/utilities/UserService';
import { IndexedDbStorage } from '~/utilities/IndexedDbStorage';
import type { IClientKvStore } from '~/utilities/IClientKvStore';

export default defineNuxtPlugin(async (): Promise<object> => {
    const { $kv, $auth } = useNuxtApp();

    const serviceType = 'indexeddb';
    let userService;
    switch (serviceType) {
        case 'kv':
            // Use KV-based service with server-side storage
            userService = new UserService($kv as IClientKvStore);
            break;
        case 'indexeddb':
            // Use KV-based service with IndexedDB storage
            const indexedDbStore = new IndexedDbStorage();
            userService = new UserService(indexedDbStore);
            break;
        default:
            throw Error(`Unknown user service type: ${serviceType}`);
            break;
    } 

    const getOrCreateUser = async (user: any): Promise<UserProfile | null> => {
        try {
            let userProfile = await userService.getUserProfileByEmail(user.email);
            if (userProfile === null) {
                userProfile = {
                    email: user.email,
                    joinedAt: new Date(),
                    name: user.name,
                    prayerOrders: 0,
                    prayerResponses: 0,
                    visitCount: 0,
                }
            }
            await userService.saveUserProfile(userProfile);
            return userProfile;
        } catch (error) {
            console.error('Failed to get or create user:', error);
            return null;
        }
    };

    const incrementVisitCount = async (user: UserProfile) => {
        try {
            user.visitCount += 1;
            await userService.saveUserProfile(user);
            return user;
        } catch (error) {
            console.error('Failed to increment user.visitCount:', error);
            return user;
        }
    };

    // Set current user if already authenticated
    if ($auth && $auth.loggedIn && $auth.user) {
        let user = await getOrCreateUser($auth.user);
        if (user !== null) await incrementVisitCount(user);

    }

    // Watch for authentication state changes
    watch(
        () => $auth?.loggedIn,
        async (isLoggedIn) => {
            if (isLoggedIn && $auth?.user) {
                let user = await getOrCreateUser($auth.user);
                if (user !== null) await incrementVisitCount(user);
            }
        }
    );

    // Provide the UserService to the Nuxt app
    return {
        provide: {
            userService,
        },
    };
});
