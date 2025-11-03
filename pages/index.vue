<template>
    <div>
        <section>
            <h1 class="text-3xl">Welcome!</h1>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';

const menu = ref(null);
const toast = useToast();
const router = useRouter();

const items = ref([
    {
        label: 'Refresh',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Search',
        icon: 'pi pi-search'
    },
    {
        separator: true
    },
    {
        label: 'Delete',
        icon: 'pi pi-times'
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};
</script>
