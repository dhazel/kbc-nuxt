<script setup lang="ts">
import Card from 'primevue/card';
import type { PrayerOrderData } from '~types/prayerOrder';
import IntercessorsPerBoardTable from '~/components/reports/IntercessorsPerBoardTable.vue';

interface Props {
    orders: Record<string, PrayerOrderData[]>;
}

defineProps<Props>();
</script>

<template>
    <div class="overflow-x-auto">
        <div v-if="!Object.keys(orders).length" class="text-center py-8">
            <p class="text-gray-500">There are no prayers logged.</p>
        </div>
        <div v-else>
            <Card
                v-for="(boardOrders, boardName) in orders"
                :key="boardName"
                class="mb-4"
            >
                <template #title>{{ boardName }}</template>
                <template #content>
                    <IntercessorsPerBoardTable :orders="boardOrders" />
                </template>
            </Card>
        </div>
    </div>
</template>
