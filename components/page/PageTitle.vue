<template>
  <div class="w-full lg:flex justify-between items-end lg:pt-6">
    <div>
      <slot name="pretitle"></slot>
      <h1 class="leading-relaxed my-2 lg:my-0">
        <slot></slot>
      </h1>
      <span class="text-xs text-grey-300"><slot name="subtitle"></slot></span>
    </div>

    <slot name="side"></slot>
  </div>
</template>
