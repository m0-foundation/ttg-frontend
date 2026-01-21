<template>
  <div class="relative mb-2">
    <div
      :class="[{ currentdot: name === version }]"
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
    @apply text-sm lg:text-sm bg-transparent flex items-center py-1 px-2;
  }
  .status-button {
    @apply text-grey-300 capitalize;
  }
  .current {
    @apply text-green-900 font-semibold;
  }
  .currentdot {
    @apply bg-slate-600;
  }
  .defeated {
    @apply text-red-600 !important;
  }
  .expired {
    @apply text-red-600 !important;
  }
</style>
