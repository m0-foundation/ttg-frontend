<template>
  <VMenu>
    <slot name="activator">
      <div class="w-8 h-8 relative hover:bg-grey-700 cursor-pointer">
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
    <!-- This will be the content of the popover -->
    <template #popper>
      <slot></slot>
    </template>
  </VMenu>
</template>
