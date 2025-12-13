<template>
    <div v-if="isAdmin" class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Intercessor Report</h1>

        <div class="mb-4">
            <h2 class="text-xl mb-2">Worked Prayer Orders</h2>
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

        <TabView v-if="orders.length > 0">
            <TabPanel v-if="orders.length > 0" header="Month-to-month">
                <IntercessorReportTable :orders="ordersMonthToMonth" />
            </TabPanel>
            <TabPanel v-if="orders.length > 0" header="Annual Informed">
                <IntercessorReportTable :orders="ordersAnnualInformed" />
            </TabPanel>
            <TabPanel v-if="orders.length > 0" header="Annual Inspired">
                <IntercessorReportTable :orders="ordersAnnualInspired" />
            </TabPanel>
        </TabView>

        <p v-else-if="!loading && !error">No orders found.</p>
    </div>
</template>

<script setup lang="ts">
import type { PrayerOrderData } from '@/types/prayerOrder';
import { PrayerOrderType } from '@/types/prayerOrder';
import { navigateTo, useNuxtApp } from '#app';
import { onMounted, ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import IntercessorReportTable from '@/components/IntercessorReportTable.vue';

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
const orders = ref<PrayerOrderData[]>([]);
const ordersMonthToMonth = ref<PrayerOrderData[]>([]);
const ordersAnnualInformed = ref<PrayerOrderData[]>([]);
const ordersAnnualInspired = ref<PrayerOrderData[]>([]);
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
        const response = await $fetch('/api/reports/closed-prayer-orders', {
            query: {
                startDate:
                    startDate.value instanceof Date
                        ? startDate.value.toISOString().split('T')[0]
                        : startDate.value,
                endDate:
                    endDate.value instanceof Date
                        ? endDate.value.toISOString().split('T')[0]
                        : endDate.value,
            },
        });
        orders.value = response;
        ordersMonthToMonth.value = response.filter((o) =>
            [PrayerOrderType.m2mInformed, PrayerOrderType.m2mInspired]
                .includes(o.type)
        );
        ordersAnnualInformed.value = response.filter(
            (o) => o.type == PrayerOrderType.annualInformed
        );
        ordersAnnualInspired.value = response.filter(
            (o) => o.type == PrayerOrderType.annualInspired
        );
    } catch (err) {
        if (err.statusCode === 413) {
            error.value = err.statusText;
        } else {
            error.value =
                'Failed to fetch worked prayer orders. Please try again.';
        }
        console.error('Fetch error:', err);
    } finally {
        loading.value = false;
    }
};
</script>
