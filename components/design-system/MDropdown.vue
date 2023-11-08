<template lang="">
  <div class="relative inline-block text-left dropdown text-white z-30">
    <button
      aria-haspopup="true"
      aria-expanded="true"
      aria-controls="dropdown-ui"
    >
      <slot name="activator"></slot>
    </button>
    <div
      class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95"
    >
      <div
        id="dropdown-ui"
        class="absolute left-0 origin-top-left rounded-md shadow-lg outline-none"
        aria-labelledby="headlessui-menu-button-1"
        role="menu"
      >
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
