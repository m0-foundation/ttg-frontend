<template>
  <div class="mb-10">
    <div
      v-if="!hasProposals"
      class="flex items-center justify-center text-grey-primary"
    >
      No Emergency proposals
    </div>
    <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
      <ProposalCard :proposal="proposal" @on-cast="onCast" />
    </div>
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

const { epoch } = storeToRefs(spog);

const proposals = computed(
  () =>
    proposalsStore.getProposalsByState("Active").filter((p) => p.isEmergency)
      .length
);

const hasProposals = computed(() => {
  return proposals.value && proposals.value.length > 0;
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
