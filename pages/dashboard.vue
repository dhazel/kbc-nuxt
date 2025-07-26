<template>
  <div>
    <h1>Welcome to your dashboard</h1>
        <p>{{ users }}</p>

    <form @submit.prevent="submitPrayerOrder">
      <div>
        <label for="title">Title</label>
        <InputText id="title" v-model="title" required />
      </div>
      <div>
        <label for="body">Body</label>
        <Textarea id="body" v-model="body" required rows="5" />
      </div>
      <Button type="submit" label="Submit Prayer Order" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useAsyncData } from '#app';

const { $spp, $auth } = useNuxtApp();

const title = ref('');
const body = ref('');

const { data: users } = await useAsyncData('users', () => $spp.getUsers());

const submitPrayerOrder = async () => {
  if (!title.value.trim() || !body.value.trim()) {
    console.warn('Both title and body are required');
    return; // Prevent submission
  }
  try {
    const user = { name: $auth.user.name, email: $auth.user.email }; // Adjust based on actual $auth.user structure
    const prayerOrder = { title: title.value, body: body.value };
    await $spp.addPrayerOrderForInformedIntercession(user, prayerOrder);
    console.log('Prayer order added successfully');
    // Optional: Clear inputs
    title.value = '';
    body.value = '';
  } catch (error) {
    console.error('Error adding prayer order:', error);
    // Optional: Show UI error
  }
};

</script>
