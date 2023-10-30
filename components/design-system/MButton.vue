<template>
  <button type="button" :class="version">
    <MIconLoading v-show="isLoading" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
export interface MButtonProps {
  version:
    | "primary"
    | "secondary-light"
    | "secondary-dark"
    | "outline-light"
    | "outline-dark";
  isLoading: false;
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
  @apply opacity-50 cursor-not-allowed bg-primary-dark;
}
.primary {
  @apply text-black bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-green-300;
}
.secondary-dark {
  @apply border border-white text-white bg-secondary-dark hover:border-grey-primary hover:text-grey-primary focus:ring-4 focus:outline-none focus:ring-gray-300;
}

.secondary-light {
  @apply border border-secondary-dark text-secondary-dark bg-white  hover:bg-grey-primary focus:ring-4 focus:outline-none focus:ring-gray-300;
}

.outline-light {
  @apply border border-white text-white bg-transparent  hover:bg-gray-100 hover:bg-opacity-10;
}

.outline-dark {
  @apply border border-secondary-dark text-secondary-dark bg-transparent  hover:bg-gray-100 hover:bg-opacity-50;
}
</style>
