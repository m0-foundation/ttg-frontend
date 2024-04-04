<template>
  <div>
    <slot v-if="!hasProposals" name="emptyState"></slot>
    <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
      <ProposalCard
        :loading="loading"
        :proposal="proposal"
        v-bind="$attrs"
        @on-view="onViewProposal"
      />
    </div>

    <MDrawer ref="modal" @on-closed="onCloseDrawer">
      <ProposalDetails v-if="showProposal" :proposal-id="currentProposal" />
    </MDrawer>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";

export interface ProposalListProps {
  proposals: MProposal[];
  loading: boolean;
}

const props = defineProps<ProposalListProps>();
const { proposals } = toRefs(props);

const hasProposals = computed(
  () => proposals.value && proposals.value.length > 0
);

const showProposal = ref<boolean>(false);
const currentProposal = ref<string>();
const modal = ref();

async function onViewProposal(proposalId: string) {
  // do not change this oder;
  await modal.value.close(); //waits for the drawer to unmount
  showProposal.value = false; // force unmount content of drawer
  currentProposal.value = proposalId;
  showProposal.value = true;
  modal.value.open();
  window.history.pushState({}, "", `/proposal/${proposalId}`);
}

function onCloseDrawer() {
  showProposal.value = false;
  currentProposal.value = undefined;
  window.history.replaceState({}, "", "/proposals/");
}
</script>
