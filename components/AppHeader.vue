<template>
    <MegaMenu :model="items">
        <template #start>
            <NuxtLink to="/" external>
                <img src="/Catalyst_Transparent.png" style="height: 40px" />
            </NuxtLink>
        </template>
        <template #item="{ item }">
            <NuxtLink v-if="item.route" :to="item.route" external>
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
        </template>
        <template #end>
            <div class="flex items-center flex-wrap gap-3">
                <Button v-if="!$auth.loggedIn" >
                    <NuxtLink to="/api/login" external>
                        Sign In
                    </NuxtLink>
                </Button>
                <Button v-if="!$auth.loggedIn" >
                    <NuxtLink to="/api/register" external>
                        Sign Up
                    </NuxtLink>
                </Button>
                <NuxtLink v-else to="/profile" external>
                    <Avatar :image="$auth.user.picture" shape="circle" />
                </NuxtLink>
            </div>
        </template>
    </MegaMenu>
</template>

<script setup>
import { ref } from "vue";

const items = ref([
    // {
    //     label: 'About',
    //     icon: 'pi pi-info-circle',
    //     route: '/about',
    // }
]);
</script>
