<template>
  <header class="flex items-center justify-between z-50 p-6 lg:pl-16">
    <div class="flex items-end gap-4 leading-4">
      <NuxtLink to="/proposals">
        <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
      </NuxtLink>
      <span class="text-grey-500 text-sm leading-3">Gov</span>
    </div>
    <div class="flex lg:hidden">
      <button
        data-test="header-button-toggle-sidebar"
        @click="emits('toggle-sidebar')"
      >
        <span class="sr-only">Toggle main manu</span>
        <span aria-hidden="true">
          <img
            v-show="!props.sidebarOpen"
            src="/img/mobile/burguer-toggle.svg"
            alt="Menu"
          />
          <img
            v-show="props.sidebarOpen"
            src="/img/mobile/close-toggle.svg"
            alt="Close"
          />
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
