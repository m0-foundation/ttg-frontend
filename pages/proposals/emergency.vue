<template>
  <NuxtLayout name="proposals">
    <ProposalList
      :proposals="proposals"
      @on-cast="castVote"
      :loading="isLoading"
    >
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
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";

const proposalsStore = useProposalsStore();

useHead({
  titleTemplate: "%s - Emergency proposals",
});

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();

const isLoading = ref(false);

const proposals = computed(() =>
  proposalsStore.getProposalsTypeEmergency.filter((p) => p.state === "Active")
);

const wagmiConfig = useWagmiConfig();
const proposalStore = useProposalsStore();
const alerts = useAlertsStore();

async function castVote(vote: number, proposalId: string) {
  await forceSwitchChain();

  isLoading.value = true;

  const governor = useGovernor({ proposalId });
  console.log("cast", { vote, proposalId, governor });

  try {
    const hash = await writeContract(wagmiConfig, {
      address: governor!.address as Hash,
      abi: governor!.abi as Abi,
      functionName: "castVote",
      args: [BigInt(proposalId), vote],
      account: userAccount.value,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was not successful");
    }

    proposalStore.updateProposalById(proposalId);

    alerts.successAlert("Vote casted successfully!");
  } catch (error) {
    console.error("Error casting vote", error);
    alerts.errorAlert("Error when casting vote!");
  }

  isLoading.value = false;
}
</script>
