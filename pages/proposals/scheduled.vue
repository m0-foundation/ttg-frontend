<template>
  <LayoutPage>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Voting cycle: 1 Apr - 30 Apr</div>
        <div>In the nex 12 days</div>
      </div>

      <div v-if="!proposals || !proposals.length">No Scheduled proposals.</div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" />
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "with-navbar",
});

const store = useProposalsStore();
const { getProposalsByState } = storeToRefs(store);
const proposals = getProposalsByState.value("Pending");
</script>
