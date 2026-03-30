<template>
    <Menu :model="menuItems" />
</template>

<script setup>
import { computed } from 'vue';
import { navigateTo } from '#app';
import { usePermissionsStore } from '~/stores/permissions';
import Menu from 'primevue/menu';

const permissionsStore = usePermissionsStore();

const showAdmin = computed(() =>
    permissionsStore.permissions.includes('admin')
);

const menuItems = computed(() => [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi',
                command: () => {
                    navigateTo('/dashboard');
                    if (props.onItemClick) props.onItemClick();
                },
            },
        ]
    },
    {
        label: 'Reports',
        items: [
            {
                label: 'Intercessor Report',
                icon: 'pi',
                visible: showAdmin.value,
                command: () => {
                    navigateTo('/reports/intercessors');
                    if (props.onItemClick) props.onItemClick();
                },
            },
        ]
    },
    {
        label: 'About',
        icon: 'pi pi-info-circle',
        visible: false,
        command: () => {
            navigateTo('/about');
            if (props.onItemClick) props.onItemClick();
        },
    },
]);

const props = defineProps({
    variant: {
        type: String,
        required: true,
        validator: (value) => ['desktop', 'mobile'].includes(value),
    },
    onItemClick: {
        type: Function,
        default: undefined,
    },
});
</script>
