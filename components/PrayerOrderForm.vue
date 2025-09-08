<template>
  <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="flex justify-center flex-col gap-4 w-3xl" @submit="submitPrayerOrder">
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
    <Button type="submit" label="Submit Prayer Order" :loading="isSubmitting" />
  </Form>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
import { useNuxtApp } from '#app';

const { $sppService, $auth } = useNuxtApp();

const toast = useToast();

const isSubmitting = ref(false);

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
  if (valid && !isSubmitting.value) {
    isSubmitting.value = true;
    try {
      const user = { name: $auth.user.name, email: $auth.user.email };
      const prayerOrder = { title: values.subject, body: values.details };

      await $sppService.addPrayerOrder(user, prayerOrder);

      toast.add({ severity: 'success', summary: 'Prayer order added', life: 3000 });
      console.log('Prayer order added successfully');
      $form.reset();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error adding prayer order', life: 3000 });
      console.error('Error adding prayer order:', error);
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>