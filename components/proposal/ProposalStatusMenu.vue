<template>
  <div class="bg-grey-600 whitespace-nowrap">
    <div class="p-6 py-3 text-xxs">
      <p class="text-grey-300">Status updated</p>
      <p class="text-grey-100">Mon Oct 30 17:04pm</p>
    </div>
    <hr class="border-grey-1000" />
    <ul v-if="statusBlock" class="status-menu-items">
      <li>
        <a target="_blank" href="">View on Block Explorer </a>
      </li>
      <li>
        <a @click="copyToClipboard('')">
          <p>Copy Ethereum Block</p>
          <p class="text-grey-400 text-xxs">{{ proposal?.blockNumber }}</p></a
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "~/lib/api/types";

export interface Props {
  proposal: MProposal | undefined;
  statusBlock: number | undefined;
}

defineProps<Props>();
</script>

<style>
.status-menu-items {
  @apply bg-grey-600;
}
.status-menu-items li a {
  @apply p-6 py-4 block hover:bg-grey-800 whitespace-nowrap cursor-pointer;
}

.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
