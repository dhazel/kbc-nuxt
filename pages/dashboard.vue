<template>
  <div>
    <h1>Welcome to your dashboard</h1>
    <AppAlert>
      This is an auto-imported component
    </AppAlert>
  </div>
</template>


<script setup lang="ts">
definePageMeta({
  middleware: ['auth-logged-in'],
})
</script>
