<template>
    <Menu :model="menuItems" />
</template>

<script setup>
import { computed } from 'vue';
import { usePermissionsStore } from '~/stores/permissions';
import Menu from 'primevue/menu';

const permissionsStore = usePermissionsStore();

const showAdmin = computed(() =>
    permissionsStore.permissions.includes('admin')
);

const menuItems = computed(() => [
    {
        label: 'About',
        icon: 'pi pi-info-circle',
        routerLink: '/about',
        visible: false,
    },
    {
        label: 'Intercessor Report',
        icon: 'pi',
        routerLink: '/reports/intercessors',
        visible: showAdmin.value,
        command:
            props.onItemClick
                ? () => props.onItemClick()
                : undefined,
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
