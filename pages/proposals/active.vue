<template>
  <LayoutPage>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Voting cycle: 1 Apr - 30 Apr</div>
        <div>12 days left</div>
      </div>
      <div v-for="p in proposals" :key="p.proposalId">
        <ProposalCard :proposal="p" />
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "with-navbar",
  middleware: ["auth"],
});

const { client } = useSpog();
const store = useProposalsStore();
const { getProposals } = storeToRefs(store);
const proposals = getProposals;

const { isLoading } = useAsyncState(client.getGovernorVoteProposals(), 0, {
  onSuccess: (data) => {
    store.setProposals(data);
  },
});
</script>
