<template>
  <div class="flex justify-between">
    <div class="inline-flex text-grey-600 gap-1 lg:gap-2 items-center">
      <div class="text-grey-primary hidden lg:block text-xs">Status:</div>

      <ProposalStatusBadge :version="version" name="Pending" />

      <ProposalStatusBadge :version="version" name="Active" />

      <ProposalStatusBadge
        v-if="version === 'Defeated'"
        :version="version"
        name="Defeated"
        class="defeated"
      />

      <ProposalStatusBadge v-else :version="version" name="Succeeded" />

      <ProposalStatusBadge
        v-if="version === 'Expired'"
        :version="version"
        name="Expired"
        class="expired"
      />

      <UDropdown v-else-if="version === 'Executed'" :items="dropdownItems">
        <ProposalStatusBadge
          :version="version"
          name="Executed"
          :show-arrow="true"
          data-test="executed-badge"
          class="cursor-pointer"
        />
      </UDropdown>

      <ProposalStatusBadge v-else :version="version" name="Executed" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";

export interface Props {
  version: string;
  proposal: MProposal | undefined;
}

const props = defineProps<Props>();
const { toFormat } = useDate(Number(props?.proposal?.executedEvent?.timestamp));

const dropdownItems = ref([
  [
    {
      label: `Executed on ${toFormat("lll")}`,
      disabled: true,
      labelClass: "cursor-auto",
    },
    {
      label: "Copy block number",
      icon: "i-heroicons-clipboard",
      click: () => copyToClipboard(props.proposal?.blockNumber),
    },
    {
      label: "View on block explorer",
      icon: "i-heroicons-globe-alt",
      to: useBlockExplorer("tx", props.proposal?.transactionHash || ""),
      target: "_blank",
    },
  ],
]);
</script>
