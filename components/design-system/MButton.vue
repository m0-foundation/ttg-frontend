<template>
  <button type="button" :class="version">
    <MIconLoading v-show="isLoading" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
  export interface MButtonProps {
    version?:
      | 'primary'
      | 'secondary-light'
      | 'secondary-dark'
      | 'outline-light'
      | 'outline-dark'
    isLoading?: boolean
  }

  withDefaults(defineProps<MButtonProps>(), {
    version: 'primary',
    isLoading: false,
  })
</script>
<style scoped>
  button {
    @apply font-inter font-medium text-sm px-4 py-2 text-center flex items-center;
  }
  button:disabled {
    @apply cursor-not-allowed bg-slate-300 border border-grey-700 hover:border-grey-700 text-grey-600 hover:bg-slate-300;
  }
  .primary {
    @apply text-white bg-accent-blue hover:bg-blue-800;
  }
  .secondary-dark {
    @apply border border-white text-white bg-secondary-dark hover:border-grey-400 hover:text-grey-400 focus:ring-4 focus:outline-none focus:ring-gray-300;
  }

  .secondary-light {
    @apply text-grey-900 bg-slate-200  hover:bg-slate-300;
  }

  .outline-light {
    @apply border border-grey-200 text-grey-900 bg-transparent hover:bg-gray-100 hover:bg-opacity-10;
  }

  .outline-dark {
    @apply border border-secondary-dark text-secondary-dark bg-transparent  hover:bg-gray-100 hover:bg-opacity-50;
  }
</style>
