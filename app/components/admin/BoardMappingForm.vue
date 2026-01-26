<template>
    <form @submit.prevent="submitForm">
        <div class="p-fluid">
            <div class="field">
                <label for="mondayBoard">Monday Board *</label>
                <Dropdown
                    id="mondayBoard"
                    v-model="formData.mondayBoardId"
                    :options="mondayBoards"
                    option-label="boardName"
                    option-value="id"
                    placeholder="Select a Monday board"
                    show-clear
                    :disabled="props.isEdit"
                    :class="{ 'p-invalid': errors.mondayBoardId }"
                />
                <small v-if="errors.mondayBoardId" class="p-error">{{
                    errors.mondayBoardId
                }}</small>
            </div>

            <div class="field">
                <label for="subscription">Subscription *</label>
                <Dropdown
                    id="subscription"
                    v-model="formData.subscriptionId"
                    :options="subscriptions"
                    option-label="name"
                    option-value="id"
                    placeholder="Select a subscription"
                    :class="{ 'p-invalid': errors.subscriptionId }"
                />
                <small v-if="errors.subscriptionId" class="p-error">{{
                    errors.subscriptionId
                }}</small>
            </div>

            <div class="field">
                <label for="intercessionType">Intercession Type *</label>
                <Dropdown
                    id="intercessionType"
                    v-model="formData.intercessionTypeId"
                    :options="intercessionTypes"
                    option-label="name"
                    option-value="id"
                    placeholder="Select an intercession type"
                    :class="{ 'p-invalid': errors.intercessionTypeId }"
                />
                <small v-if="errors.intercessionTypeId" class="p-error">{{
                    errors.intercessionTypeId
                }}</small>
            </div>
        </div>

        <div class="flex justify-end mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text"
                @click="$emit('cancel')"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                type="submit"
                :loading="saving"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

interface Props {
    mapping?: any;
    isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    mapping: null,
    isEdit: false,
});

const emit = defineEmits<{
    save: [];
    cancel: [];
}>();

const toast = useToast();

// Data
const subscriptions = ref([]);
const intercessionTypes = ref([]);
const mondayBoards = ref([]);
const saving = ref(false);
const formData = reactive({
    subscriptionId: null as number | null,
    intercessionTypeId: null as number | null,
    mondayBoardId: null as number | null,
});
const errors = reactive({
    subscriptionId: '',
    intercessionTypeId: '',
});

// Methods
const fetchOptions = async () => {
    try {
        [subscriptions.value, intercessionTypes.value, mondayBoards.value] =
            await Promise.all([
                $fetch('/api/subscriptions'),
                $fetch('/api/intercession-types'),
                $fetch('/api/monday-boards'),
            ]);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load options',
            life: 3000,
        });
    }
};

const validateForm = () => {
    errors.subscriptionId = formData.subscriptionId
        ? ''
        : 'Subscription is required';
    errors.intercessionTypeId = formData.intercessionTypeId
        ? ''
        : 'Intercession Type is required';
    errors.mondayBoardId = formData.mondayBoardId
        ? ''
        : 'Monday Board is required';
    return (
        !errors.subscriptionId &&
        !errors.intercessionTypeId &&
        !errors.mondayBoardId
    );
};

const submitForm = async () => {
    if (!validateForm()) return;

    try {
        saving.value = true;
        const data = {
            subscriptionId: formData.subscriptionId!,
            intercessionTypeId: formData.intercessionTypeId!,
            mondayBoardId: formData.mondayBoardId,
        };

        if (props.isEdit && props.mapping) {
            await $fetch(`/api/board-mappings/${props.mapping.id}`, {
                method: 'PUT',
                body: data,
            });
        } else {
            await $fetch('/api/board-mappings', {
                method: 'POST',
                body: data,
            });
        }

        emit('save');
    } catch (error: any) {
        let message = 'Failed to save mapping';
        if (error.status === 400) {
            message = error.data?.message || 'Invalid data';
        } else if (error.status === 409) {
            message = 'Mapping already exists';
        }
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
        });
    } finally {
        saving.value = false;
    }
};

// Watch for props.mapping to populate form
watch(
    () => props.mapping,
    (newMapping) => {
        if (newMapping) {
            formData.subscriptionId = newMapping.subscriptionId;
            formData.intercessionTypeId = newMapping.intercessionTypeId;
            formData.mondayBoardId = newMapping.mondayBoardId;
        } else {
            formData.subscriptionId = null;
            formData.intercessionTypeId = null;
            formData.mondayBoardId = null;
        }
        errors.subscriptionId = '';
        errors.intercessionTypeId = '';
    },
    { immediate: true }
);

// Lifecycle
onMounted(() => {
    fetchOptions();
});
</script>

<style scoped>
.field {
    margin-bottom: 1rem;
}
</style>
