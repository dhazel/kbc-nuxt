<template>
    <div>
        <section class="mb-12">
            <h1 class="text-3xl">
                Welcome{{ userName ? ` ${userName}` : '' }}!
            </h1>
        </section>
        <section>
            <Card style="width: 25rem; overflow: hidden" v-if="isAdmin">
                <template #header>
                    <img alt="intercessor" src="/intercessor4_cropped.jpg" />
                </template>
                <template #title>Intercessor Report</template>
                <template #subtitle>Track work completed by intercessors</template>
                <template #content>
                    <p class="m-0"></p>
                </template>
                <template #footer>
                    <div class="flex gap-4 mt-1">
                        <NuxtLink class="w-full" to="/reports/intercessors">
                            <Button class="w-full">View Report</Button>
                        </NuxtLink>
                    </div>
                </template>
            </Card>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import { onMounted, ref } from 'vue';

const { $auth, $userService } = useNuxtApp();

const isAdmin = ref(false);
const userName = ref();

onMounted(async () => {
    if ($auth.loggedIn) {
        userName.value = $auth.user.name;
    }

    try {
        const profile = await $userService.getUserProfileByEmail(
            $auth.user.email
        );
        if (profile && profile.roles.includes('admin')) {
            isAdmin.value = true;
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
    }
});
</script>
