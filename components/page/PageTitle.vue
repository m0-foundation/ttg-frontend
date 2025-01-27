<template>
  <div class="bg-[#F1F6FBED] dark:bg-inherit">
    <UContainer>
      <div class="flex justify-between gap-8 py-2 lg:py-4">
        <div>
          <div class="min-h-[24px] mb-4">
            <slot name="pretitle"></slot>
          </div>
          <h1 class="text-2xl lg:text-5xl my-4">
            <span v-if="title">{{ title }}</span>
            <slot v-else name="title"></slot>
          </h1>
          <div class="min-h-[24px] mt-4 text-sm lg:text-base">
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
    default: "",
  },
});
</script>
