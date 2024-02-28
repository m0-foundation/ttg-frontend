<template>
  <button type="button" :class="version">
    <MIconLoading v-show="isLoading" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
export interface MButtonProps {
  version?:
    | "primary"
    | "secondary-light"
    | "secondary-dark"
    | "outline-light"
    | "outline-dark";
  isLoading?: boolean;
}

const props = withDefaults(defineProps<MButtonProps>(), {
  version: "primary",
  isLoading: false,
});
</script>
<style scoped>
button {
  @apply uppercase font-mono text-sm px-4 py-2 text-center flex items-center;
}
button:disabled {
  @apply cursor-not-allowed bg-transparent border border-grey-700 hover:border-grey-700 text-grey-600 hover:bg-transparent;
}
.primary {
  @apply text-black border border-accent-mint bg-accent-mint hover:border-green-800 hover:bg-green-800;
}
.secondary-dark {
  @apply border border-white text-white bg-secondary-dark hover:border-grey-400 hover:text-grey-400 focus:ring-4 focus:outline-none focus:ring-gray-300;
}

.secondary-light {
  @apply border border-secondary-dark text-secondary-dark bg-white  hover:bg-grey-400 focus:ring-4 focus:outline-none focus:ring-gray-300;
}

.outline-light {
  @apply border border-white text-white bg-transparent  hover:bg-gray-100 hover:bg-opacity-10;
}

.outline-dark {
  @apply border border-secondary-dark text-secondary-dark bg-transparent  hover:bg-gray-100 hover:bg-opacity-50;
}
</style>
