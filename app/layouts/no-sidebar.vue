<template>
    <div class="min-h-screen">
        <header>
            <AppHeader />
        </header>
        <div class="flex-1 flex flex-col">
            <Toast />
            <main class="container mx-auto mt-6 flex-1">
                <slot />
            </main>
            <footer>
                <AppFooter />
            </footer>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import { usePermissionsStore } from '~/stores/permissions';

const { $auth } = useNuxtApp();
const permissionsStore = usePermissionsStore();

onMounted(async () => {
    if ($auth.loggedIn) {
        await permissionsStore.fetchPermissions();
    }
});

watch($auth.loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
        await permissionsStore.fetchPermissions();
    }
});
</script>
