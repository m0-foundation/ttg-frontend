<template>
  <button
    class="flex gap-1 items-center justify-center h-9 lg:w-min uppercase px-6"
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
  @apply text-grey-100 border border-grey-700 bg-grey-700 hover:bg-grey-600;
}

.active {
  @apply text-grey-900 bg-accent-mint;
}

button:disabled {
  @apply border border-grey-600   opacity-50 cursor-not-allowed;
}

button:disabled .outside-circle {
  @apply border border-grey-100 text-grey-100 bg-transparent cursor-not-allowed;
}

.outside-circle {
  @apply w-3 h-3 left-0 top-0 absolute rounded-full border border-grey-100;
}

.active .outside-circle {
  @apply border-grey-900;
}

.internal-circle {
  @apply hidden w-1.5 h-1.5 left-[3px] top-[3px] absolute rounded-full;
}

.active .internal-circle {
  @apply block  bg-grey-900;
}
</style>
