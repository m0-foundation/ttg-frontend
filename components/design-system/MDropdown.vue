<template lang="">
  <div class="relative inline-block text-left dropdown z-30">
    <button
      aria-haspopup="true"
      aria-expanded="true"
      aria-controls="dropdown-ui"
    >
      <slot name="activator">
        <div class="w-8 h-8 relative hover:bg-grey-700">
          <div class="w-8 h-8 left-0 top-0 absolute"></div>
          <div
            class="w-0.5 h-0.5 left-[10px] top-[15px] absolute bg-gray-100"
          ></div>
          <div
            class="w-0.5 h-0.5 left-[15px] top-[15px] absolute bg-gray-100"
          ></div>
          <div
            class="w-0.5 h-0.5 left-[20px] top-[15px] absolute bg-gray-100"
          ></div>
        </div>
      </slot>
    </button>
    <div
      class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95"
    >
      <div
        id="dropdown-ui"
        :class="`absolute ${origin}-0 origin-top-left rounded-md shadow-lg outline-none`"
        aria-labelledby="headlessui-menu-button-1"
        role="menu"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  origin: {
    type: String,
    default: "left",
  },
});
</script>

<style>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}

.dropdown-menu-items {
  @apply bg-grey-700 shadow-sm shadow-grey-1000 font-inter;
}
.dropdown-menu-items li a {
  @apply px-6 py-3 block hover:bg-grey-900 whitespace-nowrap cursor-pointer;
}
</style>
