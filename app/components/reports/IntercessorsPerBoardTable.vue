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
        totals[order.intercessor] = (totals[order.intercessor] || 0) + 1;
    });
    return Object.entries(totals).map(([intercessor, count]) => ({
        intercessor,
        count,
    }));
});

const totalPrayers = computed(() =>
    intercessorTotals.value.reduce((sum, item) => sum + item.count, 0)
);
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
                <template #footer>
                    <span class="font-bold">Total: </span>
                    <span class="font-bold">{{ totalPrayers }}</span>
                </template>
            </DataTable>
        </div>
    </div>
</template>
