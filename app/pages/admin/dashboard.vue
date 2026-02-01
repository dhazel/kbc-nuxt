<template>
    <PageGuard permission="admin">
        <div class="p-6">
            <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Data Synchronization Section -->
                <Card class="p-4">
                    <template #title>Data Synchronization</template>
                    <template #content>
                        <p class="mb-4">Sync data from external sources.</p>
                        <Button
                            label="Sync Monday Data"
                            icon="pi pi-sync"
                            :loading="syncLoading"
                            :disabled="syncLoading"
                            class="w-full"
                            @click="syncMondayData"
                        />
                    </template>
                </Card>

                <!-- Placeholder for Future Controls -->
                <Card class="p-4">
                    <template #title>System Settings</template>
                    <template #content>
                        <p>Additional admin controls will be added here.</p>
                    </template>
                </Card>

                <!-- Another Placeholder -->
                <Card class="p-4">
                    <template #title>User Management</template>
                    <template #content>
                        <p>User-related admin features coming soon.</p>
                    </template>
                </Card>
            </div>

            <!-- Toast for notifications -->
            <Toast />
        </div>
    </PageGuard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const syncLoading = ref(false);

const syncMondayData = async () => {
    try {
        syncLoading.value = true;
        await $fetch('/api/sync/monday', { method: 'POST' });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Monday data sync completed successfully',
            life: 3000,
        });
    } catch (error) {
        console.error('Sync error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to sync Monday data',
            life: 3000,
        });
    } finally {
        syncLoading.value = false;
    }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
