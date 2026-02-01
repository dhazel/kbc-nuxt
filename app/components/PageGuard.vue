<template>
    <ProgressSpinner v-if="loading" />
    <slot v-else-if="hasPermission" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo, useNuxtApp } from '#app';
import { usePermissionsStore } from '~/stores/permissions';

const props = defineProps<{
    permission: string;
}>();

const { $auth } = useNuxtApp();
const permissionsStore = usePermissionsStore();

const hasPermission = ref(false);
const loading = ref(true);

onMounted(async () => {
    if (!$auth.loggedIn) {
        navigateTo('/');
        return;
    }

    await permissionsStore.fetchPermissions();
    if (permissionsStore.permissions.includes(props.permission)) {
        hasPermission.value = true;
    } else {
        navigateTo('/');
    }
    loading.value = false;
});
</script>
