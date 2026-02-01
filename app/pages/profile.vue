<template>
    <PageGuard>
        <div>
            <AvatarMeta />

            <Button v-if="$auth.loggedIn" @click="handleLogout">
                Sign Out
            </Button>
        </div>
    </PageGuard>
</template>

<script setup lang="ts">
import { usePermissionsStore } from '~/stores/permissions';
import { navigateTo } from '#app';

const permissionsStore = usePermissionsStore();

const handleLogout = () => {
    permissionsStore.resetPermissions();
    window.location.href = '/api/logout';
};
</script>
