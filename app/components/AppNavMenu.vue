<template>
    <ul class="list-none p-3 m-0 flex-1">
        <li v-show="false">
            <NuxtLink
                to="/about"
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
                <span class="pi pi-info-circle mr-2" />
                <span>About</span>
            </NuxtLink>
        </li>
        <li v-show="showAdmin">
            <NuxtLink
                to="/reports/intercessors"
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
                <span class="pi mr-2" />
                <span>Intercessor Report</span>
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup>
import { computed } from 'vue';
import { usePermissionsStore } from '~/stores/permissions';

const permissionsStore = usePermissionsStore();

const showAdmin = computed(() =>
    permissionsStore.permissions.includes('admin')
);

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
