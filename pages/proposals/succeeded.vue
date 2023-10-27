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
import { waitForTransaction } from "@wagmi/core";
import { writeDualGovernor } from "@/lib/sdk";
import { MProposal } from "@/lib/api/types";

const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded")
);

const { address: userAccount } = useAccount();
const spog = useSpogStore();

async function onExecute(proposal: MProposal) {
  const { description, calldatas } = proposal;
  const hashedDescription = keccak256(toHex(description));
  const targets = [spog.contracts.governor as Hash];
  const values = [BigInt(0)]; // do not change

  const { hash } = await writeDualGovernor({
    address: spog.contracts.governor as Hash,
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
