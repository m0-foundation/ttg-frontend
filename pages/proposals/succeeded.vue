<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div v-if="!proposals || !proposals.length">
        No Proposals to be executed.
      </div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

const proposalsStore = useProposalsStore();

const { getProposalsByState } = storeToRefs(proposalsStore);

const proposals = getProposalsByState.value("Succeeded");
</script>
