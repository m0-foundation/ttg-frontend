<template>
  <div class="bg-grey-800 whitespace-nowrap">
    <div class="p-6 py-3 text-xxs">
      <p class="text-grey-600">Status updated</p>
      <p v-if="updated" class="text-grey-100">{{ toFormat("LLL") }}</p>
    </div>
    <hr class="border-grey-1000" />
    <ul class="status-menu-items">
      <li v-if="txHash">
        <a target="_blank" :href="useBlockExplorer('tx', txHash)"
          >View on Block Explorer
        </a>
      </li>
      <li v-if="statusBlock">
        <a @click="copyToClipboard(statusBlock)">
          <p>Copy Ethereum Block</p>
          <p class="text-grey-100 text-xxs">{{ statusBlock }}</p></a
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";

export interface Props {
  updated?: number | undefined;
  statusBlock?: number | undefined;
  txHash?: Hash | undefined | string;
}

const props = defineProps<Props>();

const { toFormat } = useDate(Number(props?.updated));
</script>

<style>
.status-menu-items {
  @apply bg-grey-800;
}
.status-menu-items li a {
  @apply p-6 py-4 block hover:bg-grey-600 text-grey-100 whitespace-nowrap cursor-pointer;
}

.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
