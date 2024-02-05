<template>
  <div class="p-6 py-2 lg:p-0 w-full lg:flex justify-between items-end">
    <div>
      <slot name="pretitle"></slot>
      <h1 class="leading-relaxed">
        <slot></slot>
      </h1>
      <span class="text-xs text-grey-300"><slot name="subtitle"></slot></span>
    </div>

    <slot name="side"></slot>
  </div>
</template>
