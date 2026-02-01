<template>
    <slot v-if="hasPermission" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { usePermissionsStore } from '~/stores/permissions';

const props = defineProps<{
    permission: string;
}>();

const { $auth } = useNuxtApp();
const permissionsStore = usePermissionsStore();

const hasPermission = ref(false);

onMounted(async () => {
    if (!$auth.loggedIn) {
        return;
    }

    await permissionsStore.fetchPermissions();
    hasPermission.value = permissionsStore.permissions.includes(
        props.permission
    );
});
</script>
