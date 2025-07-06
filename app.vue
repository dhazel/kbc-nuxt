
<script setup lang="ts">
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- Display user information when signed in -->
    <ul v-if="Boolean($auth.user)"> 
      <li v-for="(value, key) in $auth.user"><b>{{ key }}:</b> {{ value }}</li>
    </ul>

    <NuxtLink to="/api/login" external>
        Sign in
    </NuxtLink>
    <NuxtLink to="/api/register" external>
        Sign up
    </NuxtLink>
  </div>
</template>
