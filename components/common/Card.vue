<template>
  <UCard
    class="shadow-none border-gray-100 border ring-0"
    :ui="{
      header: {
        padding: 'pb-0',
      },
      body: {
        padding: 'py-4',
      },
      divide: 'divide-none',
    }">
    <template #header v-if="$slots.header || props.title">
      <div class="flex flex-wrap gap-2 justify-between items-center">
        <h2 class="text-xl font-medium font-grey-900 leading-2">
          {{ props.title }}
        </h2>
        <slot name="header-right" />
      </div>
    </template>

    <slot />

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title?: string
  }>()
</script>
