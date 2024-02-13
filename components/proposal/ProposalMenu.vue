<template lang="">
  <div class="relative inline-block text-left dropdown font-inter">
    <button
      aria-haspopup="true"
      aria-expanded="true"
      aria-controls="headlessui-menu-items-117"
      class="w-8 h-8 relative"
      data-test="proposal-button-extra-menu"
    >
      <div class="w-8 h-8 left-0 top-0 absolute hover:bg-gray-200"></div>
      <div
        class="w-0.5 h-0.5 left-[10px] top-[15px] absolute bg-neutral-900"
      ></div>
      <div
        class="w-0.5 h-0.5 left-[15px] top-[15px] absolute bg-neutral-900"
      ></div>
      <div
        class="w-0.5 h-0.5 left-[20px] top-[15px] absolute bg-neutral-900"
      ></div>
    </button>
    <div
      class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95"
    >
      <div
        id="headlessui-menu-items-117"
        class="absolute right-0 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
        aria-labelledby="headlessui-menu-button-1"
        role="menu"
      >
        <ul class="menu-items">
          <li>
            <a
              data-test="proposal-link-copy-url"
              @click="
                copyToClipboard(
                  useBlockExplorer('tx', props?.proposal?.transactionHash)
                )
              "
            >
              Copy url
            </a>
          </li>
          <li>
            <a
              data-test="menu-proposal-id"
              @click="copyToClipboard(props?.proposal?.proposalId)"
            >
              Copy Proposal ID
            </a>
          </li>
          <li>
            <a
              target="_blank"
              :href="useBlockExplorer('tx', props?.proposal?.transactionHash)"
              data-test="proposal-link-view-block-explorer"
            >
              View on Block Explorer
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import { copyToClipboard } from "@/utils/misc";

export interface ProposalProps {
  proposal: MProposal;
}

const props = defineProps<ProposalProps>();
</script>
<style>
.menu-items {
  @apply bg-grey-800;
}
.menu-items li a {
  @apply px-6 py-3 block text-grey-100 hover:bg-grey-600 whitespace-nowrap cursor-pointer;
}

.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
