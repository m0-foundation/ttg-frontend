<template lang="">
  <div
    :id="version === name ? 'proposal-state' : undefined"
    :class="[{ active: name === version }, 'item']"
    class="status-button group"
  >
    {{ name }}

    <svg
      v-if="showArrow"
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      class="status-chevron"
    >
      <path d="M1 1L3 3L5 1" stroke="#151615" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  version: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.item {
  @apply flex items-center py-1 px-2 lg:px-3;
}
.status-button {
  @apply text-grey-400 uppercase;
}
.status-chevron {
  @apply ml-1;
}
.active {
  @apply bg-[#00664E] text-[#5CC99E];
}
.active .status-chevron path {
  @apply stroke-grey-700;
}
.defeated {
  @apply bg-red-500 text-white;
}
.expired {
  @apply bg-[#EEEEEE] text-[#929492];
}
</style>
