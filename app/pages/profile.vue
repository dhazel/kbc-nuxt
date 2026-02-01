<template>
    <div>
        <AvatarMeta />

        <Button v-if="$auth.loggedIn" @click="handleLogout"> Sign Out </Button>
    </div>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '~/stores/permissions';
import { navigateTo } from '#app';

const permissionsStore = usePermissionsStore();

const handleLogout = () => {
    permissionsStore.resetPermissions();
    navigateTo('/api/logout');
};
</script>
