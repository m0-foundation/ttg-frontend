<template>
  <div class="bg-light-gray dark:bg-inherit">
    <UContainer>
      <div class="flex justify-between gap-8 py-4 lg:py-4 mt-2">
        <div>
          <div class="mb-2 text-sm">
            <slot name="pretitle"></slot>
          </div>
          <div class="max-w-4xl">
            <h1 class="text-[32px] my-2">
              <span v-if="title">{{ title }}</span>
              <slot v-else name="title"></slot>
            </h1>
          </div>
          <div class="text-base text-grey-500">
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
