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
  @apply uppercase font-medium text-sm px-4 py-2 text-center mr-3 md:mr-0 flex items-center;
}
button:disabled {
  @apply opacity-50 cursor-not-allowed bg-green-800;
}
.primary {
  @apply text-black bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300;
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
