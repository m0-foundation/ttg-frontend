<template>
  <div>
    <slot v-if="!hasProposals" name="emptyState"></slot>
    <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
      <ProposalCard
        :proposal="proposal"
        v-bind="$attrs"
        @on-view="onViewProposal"
      />
    </div>

    <MDrawer ref="modal" @on-closed="onCloseDrawer">
      <ProposalDetails
        v-if="showProposal !== undefined"
        :proposal-id="showProposal"
      />
    </MDrawer>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "~/lib/api";

export interface ProposalListProps {
  proposals: MProposal[];
}

const props = defineProps<ProposalListProps>();
const { proposals } = toRefs(props);

const hasProposals = computed(
  () => proposals.value && proposals.value.length > 0
);

const showProposal = ref<string>();
const modal = ref();

function onViewProposal(proposalId: string) {
  showProposal.value = proposalId;
  window.history.pushState({}, "", `/proposal/${proposalId}`);
  modal.value.open();
}

function onCloseDrawer() {
  showProposal.value = undefined;
  window.history.replaceState({}, "", "/proposals/");
}
</script>
