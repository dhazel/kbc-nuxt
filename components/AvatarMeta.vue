
<template>
    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
        <div class="flex items-center flex-col lg:flex-row lg:justify-between">
            <div class="flex items-start flex-col md:flex-row gap-8">
                <img :src="$auth.user.picture" class="w-[6.42rem] h-[6.42rem] rounded-md" />
                <div class="flex flex-col gap-4">
                    <div class="flex items-center">
                        <span class="text-surface-900 dark:text-surface-0 font-bold text-3xl">{{ $auth.user.name }}</span>
                    </div>
                    <div class="flex items-center flex-wrap gap-8">
                        <div>
                            <span class="text-surface-500 dark:text-surface-300">Prayer Orders</span>
                            <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">33</div>
                        </div>
                        <div>
                            <span class="text-surface-500 dark:text-surface-300">Prayer Responses</span>
                            <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">26</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 lg:mt-0 flex items-center gap-4">
                <Button icon="pi pi-bookmark" rounded severity="secondary" />
                <Button icon="pi pi-heart" rounded severity="secondary" />
                <Button icon="pi pi-list" rounded severity="secondary" />
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
definePageMeta({
  middleware: ['auth-logged-in'],
})
</script>
