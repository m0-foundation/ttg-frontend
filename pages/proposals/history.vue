<template>
  <LayoutPage>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Past Proposals</div>
      </div>
      <div v-if="!proposals || !proposals.length">No proposals to show.</div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" />
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
import { storeToRefs } from "pinia";

const store = useProposalsStore();
const { getProposalsByExcludedState } = storeToRefs(store);
const proposals = getProposalsByExcludedState.value("Active");
</script>
