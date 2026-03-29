<template>
    <PageGuard permission="admin">
        <div class="container mx-auto p-4">
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
                <TabPanel
                    v-if="store.orders.length > 0"
                    header="Month-to-month"
                >
                    <IntercessorReportTable
                        :orders="store.ordersMonthToMonth"
                    />
                </TabPanel>
                <TabPanel
                    v-if="store.orders.length > 0"
                    header="Annual Informed"
                >
                    <IntercessorReportTable
                        :orders="store.ordersAnnualInformed"
                    />
                </TabPanel>
                <TabPanel
                    v-if="store.orders.length > 0"
                    header="Annual Inspired"
                >
                    <IntercessorReportTable
                        :orders="store.ordersAnnualInspired"
                    />
                </TabPanel>
                <TabPanel v-if="store.orders.length > 0" header="Per Board">
                    <IntercessorsPerBoard :orders="store.ordersPerBoard" />
                </TabPanel>
            </TabView>
        </div>
    </PageGuard>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import IntercessorReportTable from '~/components/reports/IntercessorReportTable.vue';
import IntercessorsPerBoard from '~/components/reports/IntercessorsPerBoard.vue';
import { useIntercessorReportStore } from '~/stores/intercessorReport';

definePageMeta({
    middleware: 'auth-logged-in',
});

const store = useIntercessorReportStore();
</script>
