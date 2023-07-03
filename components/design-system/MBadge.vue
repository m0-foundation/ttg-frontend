<template>
  <span :class="version">
    <slot />
  </span>
</template>

<script lang="ts" setup>
export interface MBadgeProps {
  version: "success" | "error";
}

const props = withDefaults(defineProps<MBadgeProps>(), {
  version: "success",
});
</script>
<style scoped>
span {
  @apply text-center text-xs font-medium mr-2 px-1.5 py-0.5;
}

.success {
  @apply bg-primary text-primary-darker;
}
.error {
  @apply bg-red text-white;
}
</style>
