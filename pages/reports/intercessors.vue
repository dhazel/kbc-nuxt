<template>
    <div v-if="isAdmin" class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Intercessor Report</h1>

        <div class="mb-4">
            <h2 class="text-xl mb-2">Closed Prayer Orders</h2>
            <div class="flex gap-4 mb-4">
                <div>
                    <label for="startDate" class="block text-sm font-medium"
                        >Start Date</label
                    >
                    <DatePicker
                        id="startDate"
                        v-model="startDate"
                        model-type="string"
                        date-format="yy-mm-dd"
                    />
                </div>
                <div>
                    <label for="endDate" class="block text-sm font-medium"
                        >End Date</label
                    >
                    <DatePicker
                        id="endDate"
                        v-model="endDate"
                        model-type="string"
                        date-format="yy-mm-dd"
                    />
                </div>
                <div class="flex items-end">
                    <Button
                        label="Fetch Orders"
                        :loading="loading"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        @click="fetchOrders"
                    />
                </div>
            </div>
            <p v-if="error" class="text-red-500">{{ error }}</p>
        </div>

        <div v-if="intercessorTotals.length > 0" class="overflow-x-auto">
            <h2 class="text-xl mb-2">Closed Prayer Orders per Intercessor</h2>
            <DataTable :value="intercessorTotals" class="p-datatable-sm">
                <Column field="intercessor" header="Intercessor" />
                <Column field="count" header="Total Closed Orders" />
            </DataTable>
        </div>
        <div v-if="orders.length > 0" class="overflow-x-auto mt-8">
            <h2 class="text-xl mb-2">Closed Prayer Orders</h2>
            <DataTable :value="orders" class="p-datatable-sm">
                <Column field="status" header="Status" />
                <Column field="closeDate" header="Close Date">
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.closeDate).toLocaleDateString() }}
                    </template>
                </Column>
                <Column field="title" header="Title" />
                <Column field="intercessor" header="Intercessor" />
                <Column field="board" header="Board" />
            </DataTable>
        </div>

        <p v-else-if="!loading && !error">No orders found.</p>
    </div>
</template>

<script setup>
import { navigateTo, useNuxtApp } from '#app';
import { onMounted, ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const { $auth, $userService } = useNuxtApp();

const isAdmin = ref(false);

onMounted(async () => {
    if (!$auth.loggedIn) {
        navigateTo('/');
        return;
    }

    try {
        const profile = await $userService.getUserProfileByEmail(
            $auth.user.email
        );
        if (profile && profile.roles.includes('admin')) {
            isAdmin.value = true;
        } else {
            navigateTo('/');
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        navigateTo('/');
    }
});

const startDate = ref('');
const endDate = ref('');
const orders = ref([]);
const loading = ref(false);
const error = ref('');

const intercessorTotals = computed(() => {
    const totals = {};
    orders.value.forEach((order) => {
        if (totals[order.intercessor]) {
            totals[order.intercessor]++;
        } else {
            totals[order.intercessor] = 1;
        }
    });
    return Object.entries(totals).map(([intercessor, count]) => ({
        intercessor,
        count,
    }));
});

const fetchOrders = async () => {
    if (!startDate.value || !endDate.value) {
        error.value = 'Please select both start and end dates.';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const response = await $fetch('/api/reports/closed-prayer-orders', {
            query: {
                startDate: startDate.value instanceof Date ? startDate.value.toISOString().split('T')[0] : startDate.value,
                endDate: endDate.value instanceof Date ? endDate.value.toISOString().split('T')[0] : endDate.value,
            },
        });
        orders.value = response;
    } catch (err) {
        error.value = 'Failed to fetch closed prayer orders. Please try again.';
        console.error('Fetch error:', err);
    } finally {
        loading.value = false;
    }
};
</script>
