<template>
  <NuxtLayout name="proposals">
    <ProposalList :proposals="proposals" @on-cast="castVote">
      <template #emptyState>
        <ProposalListEmptyState>
          No emergency proposals
        </ProposalListEmptyState>
      </template>
    </ProposalList>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Abi, Hash } from "viem";
import { useAccount } from "use-wagmi";
import { writeContract } from "@wagmi/core";

const proposalsStore = useProposalsStore();

useHead({
  titleTemplate: "%s - Emergency proposals",
});

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const proposals = computed(() =>
  proposalsStore.getProposalsTypeEmergency.filter((p) => p.state === "Active")
);

async function castVote(vote: number, proposalId: string) {
  await forceSwitchChain();

  const governor = useGovernor({ proposalId });
  console.log("cast", { vote, proposalId, governor });

  return writeContract({
    address: governor!.address as Hash,
    abi: governor!.abi as Abi,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
    account: userAccount.value,
  });
}
</script>
