<template>
  <NuxtLayout name="proposals">
    <div class="mb-10">
      <ProposalList :proposals="proposals" @on-execute="onExecute">
        <template #emptyState>
          <ProposalListEmptyState>
            No Proposals to be executed
          </ProposalListEmptyState>
        </template>
      </ProposalList>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { keccak256, toHex, Hash } from "viem";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { standardGovernorABI } from "@/lib/sdk";
import { MProposal } from "@/lib/api/types";

const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded")
);

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();

useHead({
  titleTemplate: "%s - Succeeded proposals",
});

async function onExecute(proposal: MProposal) {
  await forceSwitchChain();

  const { description, calldatas } = proposal;
  const hashedDescription = keccak256(toHex(description));
  const targets = [proposal.governor as Hash];
  const values = [BigInt(0)]; // do not change

  const { hash } = await writeContract({
    abi: standardGovernorABI,
    address: proposal.governor as Hash,
    functionName: "execute",
    args: [targets, values, calldatas as Hash[], hashedDescription], // (targets, values, calldatas, hashedDescription
    account: userAccount.value,
    value: BigInt(0),
  });

  const txReceipt = await waitForTransaction({ confirmations: 1, hash });
  if (txReceipt.status !== "success") {
    throw new Error("Transaction was rejected");
  }

  return navigateTo(`/proposal/${proposal.proposalId}`, {
    external: true,
  });
}
</script>
