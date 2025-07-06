<template>
  <div>
    <h1>Welcome to your profile</h1>

    <!-- Display user information when signed in -->
    <ul v-if="Boolean($auth.loggedIn)"> 
      <li v-for="(value, key) in $auth.user"><b>{{ key }}:</b> {{ value }}</li>
    </ul>

    <AppAlert>
      This is an auto-imported component
    </AppAlert>
  </div>
</template>
