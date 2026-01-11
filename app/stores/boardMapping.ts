import { defineStore } from 'pinia';

export const useBoardMappingStore = defineStore('boardMapping', {
    state: () => ({
        mappings: [] as any[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchMappings() {
            this.loading = true;
            this.error = null;
            try {
                this.mappings = await $fetch('/api/board-mappings');
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch mappings';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createMapping(data: any) {
            this.error = null;
            try {
                const newMapping = await $fetch('/api/board-mappings', {
                    method: 'POST',
                    body: data,
                });
                this.mappings.push(newMapping);
                return newMapping;
            } catch (error: any) {
                this.error = error.message || 'Failed to create mapping';
                throw error;
            }
        },

        async updateMapping(id: number, data: any) {
            this.error = null;
            try {
                const updatedMapping = await $fetch(
                    `/api/board-mappings/${id}`,
                    {
                        method: 'PUT',
                        body: data,
                    }
                );
                const index = this.mappings.findIndex((m) => m.id === id);
                if (index !== -1) {
                    this.mappings[index] = updatedMapping;
                }
                return updatedMapping;
            } catch (error: any) {
                this.error = error.message || 'Failed to update mapping';
                throw error;
            }
        },

        async deleteMapping(id: number) {
            this.error = null;
            try {
                await $fetch(`/api/board-mappings/${id}`, { method: 'DELETE' });
                this.mappings = this.mappings.filter((m) => m.id !== id);
            } catch (error: any) {
                this.error = error.message || 'Failed to delete mapping';
                throw error;
            }
        },
    },
});
