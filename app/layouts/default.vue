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
                class="w-64 bg-gray-100 dark:bg-gray-800 flex-shrink-0 transition-all duration-300"
            >
                <div class="flex flex-col h-full">
                    <div class="flex justify-start p-2">
                        <Button
                            icon="pi pi-bars"
                            severity="secondary"
                            @click="sidebarVisible = false"
                        />
                    </div>
                    <ul class="list-none p-3 m-0 flex-1">
                        <li
                            v-for="item in items"
                            v-show="item.show"
                            :key="item.label"
                        >
                            <NuxtLink
                                :to="item.route"
                                class="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            >
                                <span :class="item.icon" class="mr-2" />
                                <span>{{ item.label }}</span>
                            </NuxtLink>
                        </li>
                    </ul>
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
                    <ul class="list-none p-3 m-0 flex-1">
                        <li
                            v-for="item in items"
                            v-show="item.show"
                            :key="item.label"
                        >
                            <NuxtLink
                                :to="item.route"
                                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded"
                                @click="closeSidebarOnMobile"
                            >
                                <span :class="item.icon" class="mr-2" />
                                <span>{{ item.label }}</span>
                            </NuxtLink>
                        </li>
                    </ul>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import { usePermissionsStore } from '~/stores/permissions';

const { $auth } = useNuxtApp();
const permissionsStore = usePermissionsStore();
const sidebarVisible = ref(false);
const isDesktop = ref(false);

const showAdmin = computed(() =>
    permissionsStore.permissions.includes('admin')
);

const items = ref([
    {
        label: 'About',
        icon: 'pi pi-info-circle',
        route: '/about',
        show: false,
    },
    {
        label: 'Intercessor Report',
        icon: 'pi',
        route: '/reports/intercessors',
        show: showAdmin,
    },
]);

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
