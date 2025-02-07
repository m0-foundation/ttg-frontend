<template>
  <button
    class="flex gap-1 items-center justify-center h-9 max-sm:w-full lg:w-min uppercase px-6"
    :class="version"
  >
    <div class="w-3 h-3 relative">
      <div class="outside-circle"></div>
      <div class="internal-circle"></div>
    </div>
    <span class="text-xs mb-[-2px] whitespace-nowrap"> <slot></slot> </span>
  </button>
</template>

<script setup lang="ts">
export interface MButtonProps {
  version: "default" | "active";
}

withDefaults(defineProps<MButtonProps>(), {
  version: "default",
});
</script>

<style>
.default {
  @apply text-grey-900 border border-gray-200 hover:bg-grey-200;
}

.active {
  @apply text-white bg-alert-success;
}

button:disabled {
  @apply border border-grey-500   opacity-50 cursor-not-allowed;
}

button:disabled .outside-circle {
  @apply border border-grey-100 text-grey-100 bg-transparent cursor-not-allowed;
}

.outside-circle {
  @apply w-3 h-3 left-0 top-0 absolute rounded-full border border-grey-500;
}

.active .outside-circle {
  @apply border-white;
}

.internal-circle {
  @apply hidden w-1.5 h-1.5 left-[3px] top-[3px] absolute rounded-full;
}

.active .internal-circle {
  @apply block  bg-white;
}
</style>
