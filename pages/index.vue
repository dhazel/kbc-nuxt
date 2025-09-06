<template>
    <div>
        <section>
            <h1 class="text-3xl">Welcome!</h1>
            <p>This is a demo site. Not for official use.</p>
        </section>
        <div v-if="$auth.loggedIn">
            <Divider/>
            <section class="mt-10">

                <Button as="a" label="Create New Prayer Order" href="/demo" icon="pi pi-pen-to-square" icon-pos="left" class="mb-5"/>

                <div class="card">
                    <Toast />
                    <Panel toggleable>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                                <span class="font-bold">Amy Elsner</span>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex flex-wrap items-center justify-between gap-4">
                                <div class="flex items-center gap-2">
                                    <Button icon="pi pi-user" rounded text/>
                                    <Button icon="pi pi-bookmark" severity="secondary" rounded text/>
                                </div>
                                <span class="text-surface-500 dark:text-surface-400">Updated 2 hours ago</span>
                            </div>
                        </template>
                        <template #icons>
                            <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
                            <Menu id="config_menu" ref="menu" :model="items" popup />
                        </template>
                        <h2 class="text-2xl">
                            Prayer Order Response
                        </h2>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Panel>
                </div>

            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: ['auth-logged-in'],
// })
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
