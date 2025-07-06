
<script setup lang="ts">
  // import { useLogtoUser } from '#imports'; // Add this line if auto-import is disabled
  const user = useLogtoUser();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- Display user information when signed in -->
    <ul v-if="Boolean(user)"> 
      <li v-for="(value, key) in user"><b>{{ key }}:</b> {{ value }}</li>
    </ul>
    <!-- Simplified button for sign-in and sign-out -->
    <a :href="`/sign-${ user ? 'out' : 'in' }`"> Sign {{ user ? 'out' : 'in' }} </a>

    <NuxtLink to="/api/login" external>
        Sign in
    </NuxtLink>
    <NuxtLink to="/api/register" external>
        Sign up
    </NuxtLink>
  </div>
</template>
