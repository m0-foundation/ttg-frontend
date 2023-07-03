<template>
  <div v-if="isLoading">
    <LayoutPage>Loading... </LayoutPage>
  </div>

  <div v-else>
    <div v-show="hasEmergencyProposals" class="p-8 bg-[#2A2D2A] mb-6">
      <MTextLoop
        class="text-white bg-[#CC0000] text-xs"
        text="EMERGENCY_VOTING"
      />
      <div class="flex justify-between uppercase text-xs mb-6">
        <div v-for="ep in emergencyProposals" :key="ep.proposalId">
          <ProposalCard :proposal="ep" />
        </div>
      </div>
    </div>

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

<script setup>
import { storeToRefs } from "pinia";

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { getProposalsByState } = storeToRefs(proposalsStore);
const { epoch } = storeToRefs(spogStateStore);

const proposals = getProposalsByState.value("Active");

const nonEmergencyProposals = computed(() => {
  return proposals.filter((p) => !p.isEmergency);
});

const emergencyProposals = computed(() => {
  return proposals.filter((p) => p.isEmergency);
});

const hasEmergencyProposals = computed(() => {
  return emergencyProposals.value.length > 0;
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
