<template>
    <PageGuard permission="admin">
        <div class="p-6">
            <h1 class="text-2xl font-bold mb-4">Board Mappings Management</h1>

            <div class="mb-4">
                <Button
                    label="Add New Mapping"
                    icon="pi pi-plus"
                    @click="showCreateDialog"
                />
            </div>

            <DataTable
                :value="boardMappings"
                class="p-datatable-sm"
                :loading="loading"
            >
                <Column
                    field="mondayBoard.mondayId"
                    header="Monday Board #"
                    sortable
                />
                <Column
                    field="mondayBoard.boardName"
                    header="Monday Board"
                    sortable
                />
                <Column
                    field="subscription.name"
                    header="Subscription"
                    sortable
                />
                <Column
                    field="intercessionType.name"
                    header="Intercession Type"
                    sortable
                />
                <Column header="Actions">
                    <template #body="slotProps">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-success p-mr-2"
                            @click="editMapping(slotProps.data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            @click="confirmDelete(slotProps.data)"
                        />
                    </template>
                </Column>
            </DataTable>

            <!-- Create/Edit Dialog -->
            <Dialog
                :visible="dialogVisible"
                :header="dialogHeader"
                modal
                @hide="hideDialog"
            >
                <BoardMappingForm
                    v-if="dialogVisible"
                    :mapping="selectedMapping"
                    :is-edit="isEditMode"
                    @save="onSave"
                    @cancel="hideDialog"
                />
            </Dialog>

            <!-- Delete Confirmation -->
            <ConfirmDialog />
        </div>
    </PageGuard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import BoardMappingForm from '~/components/admin/BoardMappingForm.vue';

const confirm = useConfirm();
const toast = useToast();

// Data
const boardMappings = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const selectedMapping = ref(null);
const isEditMode = ref(false);

// Computed
const dialogHeader = computed(() =>
    isEditMode.value ? 'Edit Mapping' : 'Create New Mapping'
);

// Methods
const showCreateDialog = () => {
    selectedMapping.value = null;
    isEditMode.value = false;
    dialogVisible.value = true;
};

const editMapping = (mapping) => {
    selectedMapping.value = mapping;
    isEditMode.value = true;
    dialogVisible.value = true;
};

const hideDialog = () => {
    dialogVisible.value = false;
    selectedMapping.value = null;
};

const confirmDelete = (mapping) => {
    confirm.require({
        message: `Are you sure you want to delete the mapping between "${mapping.mondayBoard.boardName}",  "${mapping.subscription.name}" and "${mapping.intercessionType.name}"?`,
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteMapping(mapping.id),
    });
};

const deleteMapping = async (id) => {
    try {
        loading.value = true;
        // Call delete API
        await $fetch(`/api/board-mappings/${id}`, { method: 'DELETE' });
        // Refresh list
        await fetchMappings();
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Mapping deleted successfully',
            life: 3000,
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete mapping',
            life: 3000,
        });
    } finally {
        loading.value = false;
    }
};

const fetchMappings = async () => {
    try {
        loading.value = true;
        boardMappings.value = await $fetch('/api/board-mappings');
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load mappings',
            life: 3000,
        });
    } finally {
        loading.value = false;
    }
};

const onSave = async () => {
    await fetchMappings();
    hideDialog();
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Mapping saved successfully',
        life: 3000,
    });
};

// Lifecycle
onMounted(() => {
    fetchMappings();
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
