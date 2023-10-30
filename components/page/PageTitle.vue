<template>
  <div class="p-6 pt-2 lg:pt-6 w-full lg:flex justify-between">
    <div>
      <h1
        class="text-white text-lg font-normal font-['IBM Plex Mono'] uppercase"
      >
        {{ props?.title }}<span class="text-teal-500">_</span>
      </h1>
      <span v-if="subtitle" class="text-xs text-zinc-400">{{ subtitle }}</span>
    </div>

    <slot name="side"></slot>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  subtitle: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
</script>
