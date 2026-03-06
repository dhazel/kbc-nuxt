import { defineStore } from 'pinia';
import type { PrayerOrderDto } from '~/../types/prayerOrderDto';
import { PrayerOrderType } from '~/../types/prayerOrderDto';

export const useIntercessorReportStore = defineStore('intercessorReport', {
    state: () => ({
        startDate: null as Date | null,
        endDate: null as Date | null,
        orders: [] as PrayerOrderDto[],
        ordersMonthToMonth: [] as PrayerOrderDto[],
        ordersAnnualInformed: [] as PrayerOrderDto[],
        ordersAnnualInspired: [] as PrayerOrderDto[],
        ordersPerBoard: {} as Record<string, PrayerOrderDto[]>,
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
                    '/api/reports/intercessor-activity',
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
                    (o: PrayerOrderDto) =>
                        [
                            PrayerOrderType.monthToMonthInformed,
                            PrayerOrderType.monthToMonthInspired,
                        ].includes(o.type)
                );
                this.ordersAnnualInformed = response.filter(
                    (o: PrayerOrderDto) =>
                        o.type == PrayerOrderType.annualInformed
                );
                this.ordersAnnualInspired = response.filter(
                    (o: PrayerOrderDto) =>
                        o.type == PrayerOrderType.annualInspired
                );
                this.ordersPerBoard = Object.groupBy(
                    response,
                    (po: PrayerOrderDto) => po.board
                ) as Record<string, PrayerOrderDto[]>;
            } catch (err: unknown) {
                const error = err as {
                    statusCode?: number;
                    statusText?: string;
                };
                if (error.statusCode === 413) {
                    this.error =
                        error.statusText ||
                        'Request too large. Please try a narrower date range.';
                } else {
                    this.error =
                        'Failed to fetch worked prayer orders. Please try again or try a narrower date range.';
                }
                console.error('Fetch error:', err);
            } finally {
                this.loading = false;
            }
        },
    },
});
