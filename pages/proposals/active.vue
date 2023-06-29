<template>
  <LayoutPage>
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">
          Voting cycle: {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
        </div>
        <div>ENDS {{ timeLeft }}</div>
      </div>
      <div v-if="!proposals || !proposals.length">No Active proposals.</div>
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

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { getProposalsByState } = storeToRefs(proposalsStore);
const { epoch } = storeToRefs(spogStateStore);

const proposals = getProposalsByState.value("Active");

const currentEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp));
  return toFormat("LLL");
});

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});
</script>
