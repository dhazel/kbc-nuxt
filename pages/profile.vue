<template>
  <div>
    <h1>Profile</h1>

    <AvatarMeta />

    <Button v-if="$auth.loggedIn" >
        <NuxtLink to="/api/logout" external>
            Sign Out
        </NuxtLink>
    </Button>
  </div>
</template>


<script setup lang="ts">
definePageMeta({
  middleware: ['auth-logged-in'],
})
</script>
