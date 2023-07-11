<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Voting cycle: {{ nextEpochAsDate }}</div>
        <div>STARTS {{ timeLeft }}</div>
      </div>

      <div v-if="!proposals || !proposals.length">No Scheduled proposals.</div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { epoch } = storeToRefs(spogStateStore);

const proposals = computed(() => proposalsStore.getProposalsByState("Pending"));

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});
</script>
