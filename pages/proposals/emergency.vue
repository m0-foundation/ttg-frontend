<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">
          Voting cycle: {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
        </div>
        <div>ENDS {{ timeLeft }}</div>
      </div>

      <div v-if="!hasProposals">No Emergency proposals.</div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { getProposalsTypeEmergency: proposals } = storeToRefs(proposalsStore);
const { epoch } = storeToRefs(spogStateStore);

const hasProposals = computed(() => {
  return proposals.value && proposals.value.length > 0;
});

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
