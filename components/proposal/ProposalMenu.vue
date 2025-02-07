<template>
  <UDropdown :items="dropdownItems" :ui="{ width: 'w-fit max-w-72' }">
    <UButton color="gray" icon="i-heroicons-ellipsis-horizontal" />
  </UDropdown>
</template>
<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import { copyToClipboard } from "@/utils/misc";

export interface ProposalProps {
  proposal: MProposal;
}

const props = defineProps<ProposalProps>();
const url = useRequestURL();

const dropdownItems = ref([
  [
    {
      label: "Copy proposal URL",
      icon: "i-heroicons-clipboard",
      click: () =>
        copyToClipboard(`${url.origin}/proposal/${props.proposal.proposalId}`),
    },
    {
      label: "Copy proposal ID",
      icon: "i-heroicons-clipboard",
      click: () => copyToClipboard(props.proposal.proposalId),
    },
    {
      label: "Copy block number",
      icon: "i-heroicons-clipboard",
      click: () => copyToClipboard(props.proposal.blockNumber),
    },
    {
      label: "View on block explorer",
      icon: "i-heroicons-globe-alt",
      to: useBlockExplorer("tx", props.proposal.transactionHash),
      target: "_blank",
    },
  ],
]);
</script>
