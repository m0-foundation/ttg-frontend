<template>
  <MDropdown>
    <template #activator>
      <div class="flex">
        <button>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            class="hover:bg-grey-600 hover:bg-opacity-25 group"
          >
            <rect x="10" y="15" width="2" height="2" fill="#11171D" />
            <rect x="15" y="15" width="2" height="2" fill="#11171D" />
            <rect x="20" y="15" width="2" height="2" fill="#11171D" />
          </svg>
        </button>
      </div>
    </template>
    <ul class="dropdown-menu-items">
      <li>
        <a
          v-close-popper
          data-test="proposal-link-copy-url"
          @click="
            copyToClipboard(
              `${url.origin}/proposal/${props?.proposal?.proposalId}`,
            )
          "
        >
          Copy proposal url
        </a>
      </li>
      <li>
        <a
          v-close-popper
          data-test="menu-proposal-id"
          @click="copyToClipboard(props?.proposal?.proposalId)"
        >
          Copy proposal ID
        </a>
      </li>
      <li>
        <a
          v-close-popper
          data-test="menu-proposal-id"
          @click="copyToClipboard(props?.proposal?.blockNumber)"
        >
          Copy block number
        </a>
      </li>
      <li>
        <a
          target="_blank"
          :href="useBlockExplorer('tx', props?.proposal?.transactionHash)"
          data-test="proposal-link-view-block-explorer"
        >
          View on block explorer
        </a>
      </li>
    </ul>
  </MDropdown>
</template>
<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import { copyToClipboard } from "@/utils/misc";

export interface ProposalProps {
  proposal: MProposal;
}

const props = defineProps<ProposalProps>();
const url = useRequestURL();
</script>
