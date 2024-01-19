<template>
  <div class="p-8 py-2 lg:pt-6 w-full lg:flex justify-between items-end">
    <div>
      <NuxtLink
        class="text-green-700 hover:text-green-600 text-sm uppercase cursor-pointer"
        @click="router.back()"
        >Back</NuxtLink
      >
      <h1
        class="text-white text-lg font-normal font-['IBM Plex Mono'] uppercase"
      >
        <slot></slot><span class="text-teal-500">_</span>
      </h1>
      <span class="text-xs text-grey-300"><slot name="subtitle"></slot></span>
    </div>

    <slot name="side"></slot>
  </div>
</template>

<script setup>
const router = useRouter();
</script>
