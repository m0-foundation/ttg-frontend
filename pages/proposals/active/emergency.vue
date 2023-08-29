<template>
  <div>
    <LayoutPage>
      <div v-if="!hasProposals">No Emergency proposals.</div>
      <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
        <ProposalCard :proposal="proposal" @on-cast="onCast" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import { Hash } from "viem";
import { writeIspogGovernor } from "@/lib/sdk";

const proposalsStore = useProposalsStore();
const spog = useSpogStore();
const { address: userAccount } = useAccount();

const { getProposalsTypeEmergency: proposals } = storeToRefs(proposalsStore);
const { epoch } = storeToRefs(spog);

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

function onCast(vote: number, proposalId: string) {
  console.log("cast", { vote, proposalId });
  return writeIspogGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
    account: userAccount.value,
  });
}
</script>
