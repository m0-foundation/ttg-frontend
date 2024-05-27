<template>
  <div class="bg-grey-700 whitespace-nowrap font-inter">
    <div class="p-6 py-3 text-xs">
      <p class="text-grey-500 font-ppformula">Status updated</p>
      <p v-if="updated" class="text-grey-100">{{ toFormat("LLL") }}</p>
    </div>
    <hr class="border-grey-1000" />
    <ul class="dropdown-menu-items">
      <li v-if="txHash">
        <a target="_blank" :href="useBlockExplorer('tx', txHash)"
          >View on Block Explorer
        </a>
      </li>
      <li v-if="statusBlock">
        <a @click="copyToClipboard(statusBlock)">
          <p>Copy Ethereum Block</p>
          <p class="text-grey-100 text-sm">{{ statusBlock }}</p></a
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
