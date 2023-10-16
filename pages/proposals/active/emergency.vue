<template>
  <div class="mb-10">
    <ProposalList :proposals="proposals" @on-cast="onCast">
      <template #emptyState>
        <ProposalListEmptyState>
          No Emergency proposals
        </ProposalListEmptyState>
      </template>
    </ProposalList>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { Hash } from "viem";
import { writeDualGovernor } from "@/lib/sdk";

const proposalsStore = useProposalsStore();
const spog = useSpogStore();
const { address: userAccount } = useAccount();

const proposals = computed(() =>
  proposalsStore.getProposalsByState("Active").filter((p) => p.isEmergency)
);

function onCast(vote: number, proposalId: string) {
  console.log("cast", { vote, proposalId });
  return writeDualGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
    account: userAccount.value,
  });
}
</script>
