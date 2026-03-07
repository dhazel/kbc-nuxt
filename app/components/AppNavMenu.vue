<template>
    <ul class="list-none p-3 m-0 flex-1">
        <li v-for="item in items" v-show="item.show" :key="item.label">
            <NuxtLink
                :to="item.route"
                :class="[
                    'flex items-center p-3 rounded',
                    variant === 'desktop'
                        ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100',
                ]"
                :click="
                    variant === 'mobile' && onItemClick
                        ? () => onItemClick()
                        : undefined
                "
            >
                <span :class="item.icon" class="mr-2" />
                <span>{{ item.label }}</span>
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePermissionsStore } from '~/stores/permissions';

const permissionsStore = usePermissionsStore();

const showAdmin = computed(() =>
    permissionsStore.permissions.includes('admin')
);

const items = ref([
    {
        label: 'About',
        icon: 'pi pi-info-circle',
        route: '/about',
        show: false,
    },
    {
        label: 'Intercessor Report',
        icon: 'pi',
        route: '/reports/intercessors',
        show: showAdmin,
    },
]);

defineProps({
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
