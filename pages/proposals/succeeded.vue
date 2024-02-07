<template>
  <NuxtLayout name="proposals">
    <div class="p-8">
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
import { keccak256, toHex, Hash, Abi } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { MProposal } from "@/lib/api/types";

const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded")
);

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();

useHead({
  titleTemplate: "%s - Succeeded proposals",
});

async function onExecute(proposal: MProposal) {
  await forceSwitchChain();

  const governor = useGovernor({ proposalId: proposal.proposalId });

  const { description, calldatas } = proposal;
  const hashedDescription = keccak256(toHex(description));
  const targets = [governor?.address as Hash];
  const values = [BigInt(0)]; // do not change

  const hash = await writeContract(wagmiConfig, {
    abi: governor!.abi as Abi,
    address: governor!.address as Hash,
    functionName: "execute",
    args: [targets, values, calldatas as Hash[], hashedDescription], // (targets, values, calldatas, hashedDescription
    account: userAccount.value,
    value: BigInt(0),
  });

  const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
    confirmations: 1,
    hash,
  });
  if (txReceipt.status !== "success") {
    throw new Error("Transaction was rejected");
  }

  return navigateTo(`/proposal/${proposal.proposalId}`, {
    external: true,
  });
}
</script>
