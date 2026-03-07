<template>
    <div class="flex items-center justify-between p-4 bg-white shadow">
        <div class="flex items-center">
            <Button
                v-show="!sidebarVisible"
                class="mr-2"
                icon="pi pi-bars"
                @click="toggleSidebar"
            />
            <NuxtLink to="/" external>
                <img :src="logoSrc" style="height: 40px" />
            </NuxtLink>
        </div>
        <div class="flex items-center flex-wrap gap-3">
            <Button v-if="!$auth.loggedIn">
                <NuxtLink to="/api/login" external> Sign In </NuxtLink>
            </Button>
            <Button v-if="!$auth.loggedIn">
                <NuxtLink to="/api/register" external> Sign Up </NuxtLink>
            </Button>
            <NuxtLink v-else to="/profile" external>
                <Avatar :image="$auth.user.picture" shape="circle" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue';

const colorMode = useColorMode();
const logoSrc = computed(() =>
    colorMode.value === 'dark'
        ? '/Catalyst_Transparent_dark.png'
        : '/Catalyst_Transparent.png'
);
const sidebarVisible = inject('sidebarVisible');

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};
</script>
