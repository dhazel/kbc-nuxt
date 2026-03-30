<template>
    <h1 class="text-3xl">Welcome!</h1>
</template>

<script setup lang="ts">
import { useNuxtApp, navigateTo } from '#app';
import { onMounted } from 'vue';

definePageMeta({ layout: 'no-sidebar', middleware: false });

const { $auth } = useNuxtApp();

onMounted(async () => {
    if ($auth.loggedIn) {
        await navigateTo('/dashboard');
    }
});
</script>
