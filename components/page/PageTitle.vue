<template lang="">
  <div>
    <h1 class="text-white text-lg font-normal font-['IBM Plex Mono'] uppercase">
      {{ props?.title }}<span class="text-teal-500">_</span>
    </h1>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
