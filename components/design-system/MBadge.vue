<template>
  <span :class="version">
    <slot />
  </span>
</template>

<script lang="ts" setup>
export interface MBadgeProps {
  version?: "success" | "error";
}

withDefaults(defineProps<MBadgeProps>(), {
  version: "success",
});
</script>
<style scoped>
span {
  @apply text-center text-xs font-inter px-2 py-1 border-none;
}

.success {
  @apply bg-green-700 text-green-900;
}
.error {
  @apply bg-red-700 text-white;
}
</style>
