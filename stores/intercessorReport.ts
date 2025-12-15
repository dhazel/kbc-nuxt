import { defineStore } from 'pinia';
import type { PrayerOrderData } from '@/types/prayerOrder';
import { PrayerOrderType } from '@/types/prayerOrder';

export const useIntercessorReportStore = defineStore('intercessorReport', {
    state: () => ({
        startDate: null as Date | null,
        endDate: null as Date | null,
        orders: [] as PrayerOrderData[],
        ordersMonthToMonth: [] as PrayerOrderData[],
        ordersAnnualInformed: [] as PrayerOrderData[],
        ordersAnnualInspired: [] as PrayerOrderData[],
        loading: false,
        error: '',
    }),
    actions: {
        async fetchOrders() {
            if (!this.startDate || !this.endDate) {
                this.error = 'Please select both start and end dates.';
                return;
            }

            this.loading = true;
            this.error = '';

            try {
                const response = await $fetch(
                    '/api/reports/closed-prayer-orders',
                    {
                        query: {
                            startDate: this.startDate
                                .toISOString()
                                .split('T')[0],
                            endDate: this.endDate.toISOString().split('T')[0],
                        },
                    }
                );
                this.orders = response;
                this.ordersMonthToMonth = response.filter(
                    (o: PrayerOrderData) =>
                        [
                            PrayerOrderType.monthToMonthInformed,
                            PrayerOrderType.monthToMonthInspired,
                        ].includes(o.type)
                );
                this.ordersAnnualInformed = response.filter(
                    (o: PrayerOrderData) =>
                        o.type == PrayerOrderType.annualInformed
                );
                this.ordersAnnualInspired = response.filter(
                    (o: PrayerOrderData) =>
                        o.type == PrayerOrderType.annualInspired
                );
            } catch (err: unknown) {
                const error = err as {
                    statusCode?: number;
                    statusText?: string;
                };
                if (error.statusCode === 413) {
                    this.error = error.statusText || 'Request too large';
                } else {
                    this.error =
                        'Failed to fetch worked prayer orders. Please try again.';
                }
                console.error('Fetch error:', err);
            } finally {
                this.loading = false;
            }
        },
    },
});
