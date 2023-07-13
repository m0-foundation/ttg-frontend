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

      <div v-if="!proposals || !proposals.length">No Active proposals.</div>
      <div
        v-for="proposal in nonEmergencyProposals"
        v-else
        :key="proposal.proposalId"
      >
        <ProposalCard :proposal="proposal" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { epoch } = storeToRefs(spogStateStore);
const proposals = computed(() => proposalsStore.getProposalsByState("Active"));

const nonEmergencyProposals = computed(() => {
  return proposals.value.filter((p) => !p.isEmergency);
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
