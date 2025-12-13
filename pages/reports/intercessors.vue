<template>
    <div v-if="isAdmin" class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Intercessor Report</h1>

        <div class="mb-4">
            <h2 class="text-xl mb-2">Prayer Order Activity</h2>
            <div class="flex gap-4 mb-4">
                <div>
                    <label for="startDate" class="block text-sm font-medium"
                        >Start Date</label
                    >
                    <DatePicker
                        id="startDate"
                        v-model="store.startDate"
                        model-type="Date"
                        date-format="yy-mm-dd"
                    />
                </div>
                <div>
                    <label for="endDate" class="block text-sm font-medium"
                        >End Date</label
                    >
                    <DatePicker
                        id="endDate"
                        v-model="store.endDate"
                        model-type="Date"
                        date-format="yy-mm-dd"
                    />
                </div>
                <div class="flex items-end">
                    <Button
                        label="Fetch Prayer Data"
                        :loading="store.loading"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        @click="store.fetchOrders"
                    />
                </div>
            </div>
            <p v-if="store.error" class="text-red-500">{{ store.error }}</p>
        </div>

        <TabView v-if="store.orders.length > 0">
            <TabPanel v-if="store.orders.length > 0" header="Month-to-month">
                <IntercessorReportTable :orders="store.ordersMonthToMonth" />
            </TabPanel>
            <TabPanel v-if="store.orders.length > 0" header="Annual Informed">
                <IntercessorReportTable :orders="store.ordersAnnualInformed" />
            </TabPanel>
            <TabPanel v-if="store.orders.length > 0" header="Annual Inspired">
                <IntercessorReportTable :orders="store.ordersAnnualInspired" />
            </TabPanel>
        </TabView>

        <p v-else-if="!store.loading && !store.error">No orders found.</p>
    </div>
</template>

<script setup lang="ts">
import { navigateTo, useNuxtApp } from '#app';
import { onMounted } from 'vue';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import IntercessorReportTable from '@/components/IntercessorReportTable.vue';
import { useIntercessorReportStore } from '@/stores/intercessorReport';

const { $auth, $userService } = useNuxtApp();

const store = useIntercessorReportStore();

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
</script>
