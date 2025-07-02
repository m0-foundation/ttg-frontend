<template>
  <div class="relative mb-4">
    <div
      :class="[{ current: name === version }]"
      class="absolute -left-0.5 top-2 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
    <div class="ps-6">
      <div
        :id="version === name ? 'proposal-state' : undefined"
        :class="[name.toLowerCase(), { current: name === version }, 'item']"
        class="status-button group">
        {{ name.toLowerCase() }}

        <svg
          v-if="showArrow"
          width="6"
          height="4"
          viewBox="0 0 6 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ml-1">
          <path d="M1 1L3 3L5 1" stroke="#5CC99E" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    version: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
  })
</script>

<style scoped>
  .item {
    @apply text-sm lg:text-sm bg-white flex items-center py-1 px-2;
  }
  .status-button {
    @apply text-grey-600 capitalize;
  }
  .current {
    @apply bg-green-900 text-accent-mint;
  }
  .defeated {
    @apply bg-red-600 text-white !important;
  }
  .expired {
    @apply bg-red-600 text-white !important;
  }
</style>
