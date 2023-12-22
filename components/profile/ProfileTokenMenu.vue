<template>
  <MDropdown>
    <template #activator>
      <div class="w-8 h-8 relative hover:bg-grey-700">
        <div class="w-8 h-8 left-0 top-0 absolute"></div>
        <div
          class="w-0.5 h-0.5 left-[10px] top-[15px] absolute bg-gray-200"
        ></div>
        <div
          class="w-0.5 h-0.5 left-[15px] top-[15px] absolute bg-gray-200"
        ></div>
        <div
          class="w-0.5 h-0.5 left-[20px] top-[15px] absolute bg-gray-200"
        ></div>
      </div>
    </template>
    <template #content>
      <ul class="token-menu-items">
        <li>
          <a @click="copyToClipboard(token?.address)">
            <p>{{ `Copy ${token?.symbol} token address` }}</p>
            <p class="text-grey-400 text-xxs">{{ token?.address }}</p></a
          >
        </li>
        <li>
          <a target="_blank" :href="useBlockExplorer('token', token?.address)"
            >View on Block Explorer
          </a>
        </li>
      </ul>
    </template>
  </MDropdown>
</template>

<script setup>
import { copyToClipboard } from "@/utils/misc";
defineProps({
  token: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.token-menu-items {
  @apply bg-grey-600;
}
.token-menu-items li a {
  @apply p-6 py-4 block hover:bg-grey-800 whitespace-nowrap cursor-pointer;
}

.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
