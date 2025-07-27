<template>
  <div>
    <h1 class="text-3xl">Demo</h1>

    <Toast />

    <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues"  @submit="submitPrayerOrder" class="flex justify-center flex-col gap-4 w-3xl">
      <div class="flex flex-col gap-1">
        <label for="title">Prayer Subject</label>
        <InputText id="title" name="subject" />
        <Message v-if="$form.subject?.invalid" severity="error" size="small" variant="simple">{{ $form.subject.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <label for="body">Details</label>
        <Textarea id="body" name="details" rows="5" />
        <Message v-if="$form.details?.invalid" severity="error" size="small" variant="simple">{{ $form.details.error?.message }}</Message>
      </div>
      <Button type="submit" label="Submit Prayer Order" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useAsyncData } from '#app';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
const { $spp, $auth } = useNuxtApp();

const toast = useToast();

const initialValues = ref({
    subject: '',
    details: ''
});

const resolver = ref(zodResolver(
    z.object({
        subject: z.string().min(1, { message: 'Subject is required.' }),
        details: z.string().min(1, { message: 'Details are required.' })
    })
));

const submitPrayerOrder = async ({ valid, values }) => {
  if (valid) {
    try {
      const user = { name: $auth.user.name, email: $auth.user.email };
      const prayerOrder = { title: values.subject, body: values.details };

      await $spp.addPrayerOrderForInformedIntercession(user, prayerOrder);

      toast.add({ severity: 'success', summary: 'Prayer order added', life: 3000 });
      console.log('Prayer order added successfully');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error adding prayer order', life: 3000 });
      console.error('Error adding prayer order:', error);
    }
  }
};

</script>
