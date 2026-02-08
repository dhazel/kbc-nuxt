<script setup lang="ts">
import { computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { PrayerOrderData } from '~types/prayerOrder';

interface Props {
    orders: PrayerOrderData[];
}

const props = defineProps<Props>();

const intercessorTotals = computed(() => {
    const totals: Record<string, number> = {};
    props.orders.forEach((order) => {
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
</script>

<template>
    <div class="overflow-x-auto">
        <div v-if="orders.length === 0" class="text-center py-8">
            <p class="text-gray-500">There are no prayers logged.</p>
        </div>
        <div v-else>
            <DataTable :value="intercessorTotals" class="p-datatable-sm">
                <Column field="intercessor" header="Intercessor" sortable />
                <Column field="count" header="Total Prayers" sortable />
            </DataTable>
        </div>
    </div>
</template>
