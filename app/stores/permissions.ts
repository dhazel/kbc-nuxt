import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useToast } from 'primevue/usetoast';

export const usePermissionsStore = defineStore('permissions', () => {
    const permissions = ref<string[]>([]);
    const isLoaded = ref(false);
    const isLoading = ref(false);

    const { $userService, $auth } = useNuxtApp();
    const toast = useToast();

    const fetchPermissions = async () => {
        if (isLoaded.value) return;
        if (isLoading.value) {
            // Wait for ongoing fetch
            while (isLoading.value) {
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
            return;
        }
        if (!$auth.loggedIn || !$auth.user) return;
        isLoading.value = true;
        try {
            const profile = await $userService.getUserProfileByEmail(
                $auth.user.email
            );
            if (profile) {
                permissions.value = profile.permissions;
                isLoaded.value = true;
            }
        } catch {
            toast.add({
                severity: 'error',
                summary: 'Failed to load permissions',
                life: 3000,
            });
        } finally {
            isLoading.value = false;
        }
    };

    const resetPermissions = () => {
        permissions.value = [];
        isLoaded.value = false;
        isLoading.value = false;
    };

    return {
        permissions,
        isLoaded,
        isLoading,
        fetchPermissions,
        resetPermissions,
    };
});
