<template>
  <VMenu>
    <slot name="activator">
      <div
        class="w-8 h-8 relative bg-grey-200 hover:bg-grey-200 cursor-pointer bg-opacity-30">
        <div class="w-8 h-8 left-0 top-0 absolute"></div>
        <div
          class="w-0.5 h-0.5 left-[10px] top-[15px] absolute bg-black dark:bg-gray-100"></div>
        <div
          class="w-0.5 h-0.5 left-[15px] top-[15px] absolute bg-black dark:bg-gray-100"></div>
        <div
          class="w-0.5 h-0.5 left-[20px] top-[15px] absolute bg-black dark:bg-gray-100"></div>
      </div>
    </slot>
    <!-- This will be the content of the popover -->
    <template #popper>
      <slot></slot>
    </template>
  </VMenu>
</template>
