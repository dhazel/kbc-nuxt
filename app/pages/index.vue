<template>
    <div>
        <section class="mb-12">
            <h1 class="text-3xl">
                Welcome{{ userName ? ` ${userName}` : '' }}!
            </h1>
        </section>
        <section>
            <PermissionGuard permission="admin">
                <Card style="width: 25rem; overflow: hidden">
                    <template #header>
                        <img
                            alt="intercessor"
                            src="/intercessor4_cropped.jpg"
                        />
                    </template>
                    <template #title>Intercessor Report</template>
                    <template #subtitle
                        >Track work completed by intercessors</template
                    >
                    <template #content>
                        <p class="m-0" />
                    </template>
                    <template #footer>
                        <div class="flex gap-4 mt-1">
                            <NuxtLink class="w-full" to="/reports/intercessors">
                                <Button class="w-full">View Report</Button>
                            </NuxtLink>
                        </div>
                    </template>
                </Card>
            </PermissionGuard>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import { onMounted, ref } from 'vue';
import PermissionGuard from '~/components/PermissionGuard.vue';

definePageMeta({ layout: 'no-sidebar' });

const { $auth } = useNuxtApp();

const userName = ref();

onMounted(async () => {
    if ($auth.loggedIn) {
        userName.value = $auth.user.name;
    }
});
</script>
