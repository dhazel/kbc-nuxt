<template>
    <MegaMenu :model="items">
        <template #start>
            <NuxtLink to="/" external>
                <img :src="logoSrc" style="height: 40px" />
            </NuxtLink>
        </template>
        <template #item="{ item }">
            <NuxtLink
                v-if="item.route"
                :to="item.route"
                v-show="item.show"
                external
            >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
        </template>
        <template #end>
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
        </template>
    </MegaMenu>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $auth, $userService } = useNuxtApp();
const colorMode = useColorMode();
const logoSrc = computed(() =>
    colorMode.value === 'dark'
        ? '/Catalyst_Transparent_dark.png'
        : '/Catalyst_Transparent.png'
);
const userProfile = ref(null);
const showAdmin = computed(
    () => userProfile.value?.roles.includes('admin') ?? false
);

onMounted(async () => {
    if ($auth.loggedIn && $auth.user?.email) {
        userProfile.value = await $userService.getUserProfileByEmail(
            $auth.user.email
        );
    }
});

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
</script>
