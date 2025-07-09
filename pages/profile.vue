<template>
  <div>

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
