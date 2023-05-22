<template>
  <LayoutPage>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Voting cycle: 1 Apr - 30 Apr</div>
        <div>12 days left</div>
      </div>
      <div v-for="p in proposals" :key="p.proposalId">
        <ProposalCard :description="p.description" :proposer="p.proposer" />
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
definePageMeta({
  layout: "with-navbar",
  middleware: ["auth"],
});
// const pageId = $route.params.proposal_id;
const { client } = useSpog();
console.log({ client });
const {
  state: proposals,
  isReady,
  isLoading,
} = useAsyncState(client.getGovernorVoteProposals());
console.log({ proposals, isReady, isLoading });
</script>
