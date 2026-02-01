<template>
    <slot v-if="hasPermission" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo, useNuxtApp } from '#app';

const props = defineProps<{
    permission: string;
}>();

const { $auth, $userService } = useNuxtApp();

const hasPermission = ref(false);

onMounted(async () => {
    if (!$auth.loggedIn) {
        navigateTo('/');
        return;
    }

    try {
        const profile = await $userService.getUserProfileByEmail(
            $auth.user.email
        );
        if (profile && profile.roles.includes(props.permission)) {
            hasPermission.value = true;
        } else {
            navigateTo('/');
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        navigateTo('/');
    }
});
</script>
