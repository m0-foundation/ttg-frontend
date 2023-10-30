<template>
  <header class="flex items-center justify-between z-50 p-6 min-h-[96px]">
    <div class="flex items-end gap-4 leading-4">
      <img src="/img/mzero-logo-white.svg" alt="" />
      <span class="lg:hidden">Gov</span>
      <span class="hidden lg:block text-gray-400">Governance</span>
    </div>
    <div class="flex lg:hidden">
      <button @click="emits('toggle-sidebar')">
        <span class="sr-only">Toggle main manu</span>
        <span aria-hidden="true">
          <svg
            v-show="!props.sidebarOpen"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.2051 18.5H31.7949"
              stroke="white"
              stroke-linecap="square"
            />
            <path
              d="M16.2051 24.5H31.7949"
              stroke="white"
              stroke-linecap="square"
            />
            <path
              d="M16.2051 30.5H31.7949"
              stroke="white"
              stroke-linecap="square"
            />
            <rect x="0.5" y="0.5" width="47" height="47" stroke="white" />
          </svg>

          <svg
            v-show="props.sidebarOpen"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="47" height="47" stroke="white" />
            <path
              d="M18.4881 17.9882L29.5118 29.0118"
              stroke="white"
              stroke-linecap="square"
            />
            <path
              d="M18.4882 28.5118L29.5118 17.4882"
              stroke="white"
              stroke-linecap="square"
            />
          </svg>
        </span>
      </button>
    </div>
  </header>
</template>
<script setup>
const emits = defineEmits(["toggle-sidebar"]);
const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
});
</script>
