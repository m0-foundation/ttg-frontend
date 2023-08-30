<template>
  <div class="mb-10">
    <div
      v-if="!proposals || !proposals.length"
      class="flex items-center justify-center text-grey-primary"
    >
      No Proposals to be executed
    </div>
    <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
      <ProposalCard :proposal="proposal" />
    </div>
  </div>
</template>

<script setup>
const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded")
);
</script>
