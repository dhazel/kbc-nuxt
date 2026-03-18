<template>
    <PageGuard permission="admin">
        <div class="p-6">
            <h1 class="text-2xl font-bold mb-6">Manage Organization Roles</h1>

            <div class="mb-6">
                <label for="org-select" class="block text-sm font-medium mb-2"
                    >Select Organization</label
                >
                <Dropdown
                    id="org-select"
                    v-model="selectedOrg"
                    :options="organizations"
                    option-label="name"
                    option-value="id"
                    placeholder="Choose an organization"
                    class="w-full md:w-80"
                    @change="onOrgChange"
                />
            </div>

            <div v-if="selectedOrg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">
                        Roles in {{ selectedOrgName }}
                    </h2>
                    <Button
                        label="Add Role Assignment"
                        icon="pi pi-plus"
                        @click="openAddDialog"
                    />
                </div>

                <DataTable :value="assignments" class="p-datatable-sm">
                    <Column field="user.email" header="User" sortable>
                        <template #body="slotProps">
                            {{ slotProps.data.user.name }} ({{
                                slotProps.data.user.email
                            }})
                        </template>
                    </Column>
                    <Column field="role.name" header="Role" sortable />
                    <Column header="Actions">
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-text"
                                @click="openEditDialog(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-text p-button-danger"
                                @click="confirmDelete(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Add/Edit Dialog -->
            <Dialog
                v-model:visible="dialogVisible"
                :header="
                    isEdit ? 'Edit Role Assignment' : 'Add Role Assignment'
                "
                modal
                class="p-fluid"
            >
                <div class="field">
                    <label
                        for="user-select"
                        class="block text-sm font-medium mb-2"
                        >User</label
                    >
                    <Dropdown
                        id="user-select"
                        v-model="formData.userId"
                        :options="users"
                        option-label="email"
                        option-value="id"
                        placeholder="Select a user"
                        class="w-full"
                        :disabled="isEdit"
                    >
                        <template #option="slotProps">
                            {{ slotProps.option.name }} ({{
                                slotProps.option.email
                            }})
                        </template>
                        <template #value="slotProps">
                            {{
                                slotProps.value
                                    ? `${slotProps.value.name} (${slotProps.value.email})`
                                    : 'Select a user'
                            }}
                        </template>
                    </Dropdown>
                </div>
                <div class="field mt-4">
                    <label
                        for="role-select"
                        class="block text-sm font-medium mb-2"
                        >Role</label
                    >
                    <Dropdown
                        id="role-select"
                        v-model="formData.roleId"
                        :options="roles"
                        option-label="name"
                        option-value="id"
                        placeholder="Select a role"
                        class="w-full"
                    />
                </div>
                <template #footer>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="p-button-text"
                        @click="dialogVisible = false"
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        :loading="saving"
                        @click="saveAssignment"
                    />
                </template>
            </Dialog>

            <!-- Toast -->
            <Toast />
            <ConfirmDialog />
        </div>
    </PageGuard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

interface Organization {
    id: string;
    name: string;
    description?: string;
}

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

interface Role {
    id: string;
    name: string;
}

interface Assignment {
    id: string;
    user: User;
    role: Role;
}

const toast = useToast();
const confirm = useConfirm();

const organizations = ref<Organization[]>([]);
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const assignments = ref<Assignment[]>([]);

const selectedOrg = ref<string | null>(null);
const selectedOrgName = ref<string>('');

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentAssignment = ref<Assignment | null>(null);
const formData = ref({ userId: '', roleId: '' });
const saving = ref(false);

const loadOrganizations = async () => {
    try {
        const data = await $fetch('/api/admin/organizations');
        organizations.value = data;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load organizations',
            life: 3000,
        });
    }
};

const loadUsers = async () => {
    try {
        const data = await $fetch('/api/admin/users');
        users.value = data;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users',
            life: 3000,
        });
    }
};

const loadRoles = async () => {
    try {
        const data = await $fetch('/api/admin/roles');
        roles.value = data;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load roles',
            life: 3000,
        });
    }
};

const onOrgChange = async () => {
    if (!selectedOrg.value) {
        assignments.value = [];
        selectedOrgName.value = '';
        return;
    }
    const org = organizations.value.find((o) => o.id === selectedOrg.value);
    selectedOrgName.value = org?.name || '';
    try {
        const data = await $fetch(
            `/api/admin/organizations/${selectedOrg.value}/roles`
        );
        assignments.value = data;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load assignments',
            life: 3000,
        });
    }
};

const openAddDialog = () => {
    isEdit.value = false;
    currentAssignment.value = null;
    formData.value = { userId: '', roleId: '' };
    dialogVisible.value = true;
};

const openEditDialog = (assignment: Assignment) => {
    isEdit.value = true;
    currentAssignment.value = assignment;
    formData.value = { userId: assignment.user.id, roleId: assignment.role.id };
    dialogVisible.value = true;
};

const saveAssignment = async () => {
    if (!selectedOrg.value || !formData.value.userId || !formData.value.roleId)
        return;
    saving.value = true;
    try {
        if (isEdit.value && currentAssignment.value) {
            await $fetch(
                `/api/admin/organizations/${selectedOrg.value}/roles/${currentAssignment.value.id}`,
                {
                    method: 'PUT',
                    body: { roleId: formData.value.roleId },
                }
            );
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Role assignment updated',
                life: 3000,
            });
        } else {
            await $fetch(
                `/api/admin/organizations/${selectedOrg.value}/roles`,
                {
                    method: 'POST',
                    body: {
                        userId: formData.value.userId,
                        roleId: formData.value.roleId,
                    },
                }
            );
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Role assignment added',
                life: 3000,
            });
        }
        dialogVisible.value = false;
        onOrgChange(); // Reload assignments
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save assignment',
            life: 3000,
        });
    } finally {
        saving.value = false;
    }
};

const confirmDelete = (assignment: Assignment) => {
    confirm.require({
        message: `Are you sure you want to remove the ${assignment.role.name} role from ${assignment.user.email}?`,
        header: 'Confirm Deletion',
        accept: () => deleteAssignment(assignment),
    });
};

const deleteAssignment = async (assignment: Assignment) => {
    if (!selectedOrg.value) return;
    try {
        await $fetch(
            `/api/admin/organizations/${selectedOrg.value}/roles/${assignment.id}`,
            {
                method: 'DELETE',
            }
        );
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role assignment removed',
            life: 3000,
        });
        onOrgChange(); // Reload assignments
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove assignment',
            life: 3000,
        });
    }
};

onMounted(() => {
    loadOrganizations();
    loadUsers();
    loadRoles();
});
</script>

<style scoped>
.field {
    margin-bottom: 1rem;
}
</style>
