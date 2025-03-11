<template>
  <div class="bg-light-gray dark:bg-inherit">
    <UContainer>
      <div class="flex justify-between gap-8 py-2 lg:py-4">
        <div>
          <div class="min-h-[20px] mb-2 text-sm">
            <slot name="pretitle"></slot>
          </div>
          <h1 class="text-3xl lg:text-[40px] lg:leading-tight my-2">
            <span v-if="title">{{ title }}</span>
            <slot v-else name="title"></slot>
          </h1>
          <div class="min-h-[20px] mt-2 text-sm text-grey-500">
            <slot name="subtitle"></slot>
          </div>
        </div>
        <div class="flex-box">
          <slot name="top-right"></slot>
        </div>
      </div>
      <slot />

      <div>
        <div class="flex justify-between gap-8">
          <slot name="bottom-left"></slot>
          <slot name="bottom-right"></slot>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
  })
</script>
