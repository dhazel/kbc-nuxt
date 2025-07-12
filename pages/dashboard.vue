<template>
    <div>
        <h1>Welcome to your dashboard</h1>
        <p>
            {{ users }}
        </p>
    </div>
</template>


<script setup lang="ts">
import { useNuxtApp, useAsyncData } from '#app';

definePageMeta({
  middleware: ['auth-logged-in'],
})

const { $spp } = useNuxtApp();

const { data: users } = await useAsyncData('users', () => $spp.getUsers());

</script>
