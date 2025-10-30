<template>
    <div>
        <h1>Admin Panel</h1>
        <p>Administrative functions will be added here.</p>
    </div>
</template>

<script setup>
import { navigateTo, useNuxtApp } from '#app';

const { $auth } = useNuxtApp();

if (!$auth.loggedIn) {
    navigateTo('/');
}
</script>
