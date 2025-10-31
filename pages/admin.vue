<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>

        <div class="mb-4">
            <h2 class="text-xl mb-2">Closed Prayer Orders</h2>
            <div class="flex gap-4 mb-4">
                <div>
                    <label for="startDate" class="block text-sm font-medium"
                        >Start Date</label
                    >
                    <input
                        id="startDate"
                        v-model="startDate"
                        type="date"
                        class="border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label for="endDate" class="block text-sm font-medium"
                        >End Date</label
                    >
                    <input
                        id="endDate"
                        v-model="endDate"
                        type="date"
                        class="border rounded px-3 py-2"
                    />
                </div>
                <div class="flex items-end">
                    <button
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        :disabled="loading"
                        @click="fetchOrders"
                    >
                        {{ loading ? 'Fetching...' : 'Fetch Orders' }}
                    </button>
                </div>
            </div>
            <p v-if="error" class="text-red-500">{{ error }}</p>
        </div>

        <div v-if="orders.length > 0" class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-4 py-2 border">Status</th>
                        <th class="px-4 py-2 border">Close Date</th>
                        <th class="px-4 py-2 border">Title</th>
                        <th class="px-4 py-2 border">Intercessor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="order in orders"
                        :key="order.title"
                        class="hover:bg-gray-50"
                    >
                        <td class="px-4 py-2 border">{{ order.status }}</td>
                        <td class="px-4 py-2 border">
                            {{ new Date(order.closeDate).toLocaleDateString() }}
                        </td>
                        <td class="px-4 py-2 border">{{ order.title }}</td>
                        <td class="px-4 py-2 border">
                            {{ order.intercessor }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else-if="!loading && !error">No orders found.</p>
    </div>
</template>

<script setup>
import { navigateTo, useNuxtApp } from '#app';

const { $auth } = useNuxtApp();

if (!$auth.loggedIn) {
    navigateTo('/');
}

const startDate = ref('');
const endDate = ref('');
const orders = ref([]);
const loading = ref(false);
const error = ref('');

const fetchOrders = async () => {
    if (!startDate.value || !endDate.value) {
        error.value = 'Please select both start and end dates.';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const response = await $fetch('/api/admin/closed-prayer-orders', {
            query: {
                startDate: startDate.value,
                endDate: endDate.value,
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
