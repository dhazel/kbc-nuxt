<template>
    <div class="flex items-center justify-between p-4 bg-white shadow">
        <div class="flex items-center">
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
import { computed } from 'vue';

const colorMode = useColorMode();
const logoSrc = computed(() =>
    colorMode.value === 'dark'
        ? '/Catalyst_Transparent_dark.png'
        : '/Catalyst_Transparent.png'
);
</script>
