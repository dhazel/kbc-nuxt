<template>
    <div class="min-h-screen">
        <header>
            <AppHeader />
        </header>
        <div class="p-2">
            <Button
                v-show="!sidebarVisible"
                icon="pi pi-bars"
                severity="secondary"
                @click="toggleSidebar"
            />
        </div>
        <div class="flex flex-1">
            <!-- Desktop sidebar (push-based) -->
            <div
                v-if="isDesktop"
                v-show="sidebarVisible"
                class="w-64 shrink-0 transition-all duration-300"
            >
                <div class="flex flex-col h-full">
                    <div class="flex justify-start p-2">
                        <Button
                            icon="pi pi-bars"
                            severity="secondary"
                            @click="sidebarVisible = false"
                        />
                    </div>
                    <AppNavMenu variant="desktop" />
                </div>
            </div>
            <!-- Mobile sidebar (overlay-based) -->
            <Sidebar
                v-else
                v-model:visible="sidebarVisible"
                :modal="true"
                position="left"
                class="w-64"
            >
                <div class="flex flex-col h-full">
                    <AppNavMenu
                        variant="mobile"
                        :on-item-click="closeSidebarOnMobile"
                    />
                </div>
            </Sidebar>
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
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import { usePermissionsStore } from '~/stores/permissions';

const { $auth } = useNuxtApp();
const permissionsStore = usePermissionsStore();
const sidebarVisible = ref(false);
const isDesktop = ref(false);

const closeSidebarOnMobile = () => {
    if (!isDesktop.value) {
        sidebarVisible.value = false;
    }
};

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

onMounted(async () => {
    if ($auth.loggedIn) {
        await permissionsStore.fetchPermissions();
    }
    const update = () => {
        isDesktop.value = window.innerWidth >= 768;
        console.log('isDesktop', isDesktop);
        if (isDesktop.value) {
            sidebarVisible.value = true;
        }
    };
    update();
    window.addEventListener('resize', update);
});

onUnmounted(() => {
    window.removeEventListener('resize', update);
});

watch($auth.loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
        await permissionsStore.fetchPermissions();
    }
});

provide('sidebarVisible', sidebarVisible);
</script>
