<script setup lang="ts">
import { computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { PrayerOrderData } from '~types/prayerOrder';

interface Props {
    orders: Record<string, PrayerOrderData[]>;
}

const props = defineProps<Props>();

import IntercessorsPerBoardTable from '~/components/reports/IntercessorsPerBoardTable.vue';
</script>

<template>
    <div class="overflow-x-auto">
        <div v-if="!Object.keys(orders).length" class="text-center py-8">
            <p class="text-gray-500">There are no prayers logged.</p>
        </div>
        <div v-else>
            <div v-for="(boardOrders, boardName) in orders" :key="boardName">
                <h2 class="text-xl mb-2 mt-4">{{ boardName }}</h2>
                <IntercessorsPerBoardTable :orders="boardOrders" />
            </div>
        </div>
    </div>
</template>
