<template lang="">
  <MDropdown>
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
          Copy url
        </a>
      </li>
      <li>
        <a
          v-close-popper
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
