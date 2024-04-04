<template>
  <NuxtLayout name="proposals">
    <ProposalList
      :proposals="proposals"
      :loading="isLoading"
      @on-execute="onExecute"
    >
      <template #emptyState>
        <ProposalListEmptyState>
          No Proposals to be executed
        </ProposalListEmptyState>
      </template>
    </ProposalList>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { keccak256, toHex, Hash, Abi } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { MProposal } from "@/lib/api/types";

const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded"),
);

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();
const proposalStore = useProposalsStore();
const alerts = useAlertsStore();
const isLoading = ref(false);
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

  proposalStore.updateProposalByKey(proposal.proposalId, "executing", true);
  try {
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

    alerts.successAlert("Proposal executed successfully!");

    proposalStore.updateProposalById(proposal.proposalId);
  } catch (error) {
    console.error("Error executing proposal", error);
    alerts.errorAlert("Error while executing proposal");
  } finally {
    proposalStore.updateProposalByKey(proposal.proposalId, "executing", false);
  }
}
</script>
