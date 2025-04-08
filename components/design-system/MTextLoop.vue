<template>
  <div class="relative flex overflow-x-hidden">
    <div class="py-2 whitespace-nowrap animate-slide">
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </div>
    <div class="absolute top-0 py-2 whitespace-nowrap animate-slide2">
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps({
    text: {
      type: String,
      default: '',
    },
  })
</script>
<style scoped>
  span {
    @apply mx-2;
  }
  .animate-slide {
    animation: slide 120s linear infinite;
  }

  .animate-slide2 {
    animation: slide2 120s linear infinite;
  }

  @keyframes slide {
    0% {
      transform: translateX(0);
    }

    to {
      transform: translateX(-100%);
    }
  }

  @keyframes slide2 {
    0% {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }
</style>
