
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLink to="/api/login" external>
        Sign in
    </NuxtLink>
    <NuxtLink to="/api/register" external>
        Sign up
    </NuxtLink>
  </div>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

