<template>
  <div class="mb-10">
    <ProposalList :proposals="proposals" @on-execute="onExecute">
      <template #emptyState>
        <ProposalListEmptyState>
          No Proposals to be executed
        </ProposalListEmptyState>
      </template>
    </ProposalList>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { keccak256, toHex, Hash } from "viem";
import { writeIspogGovernor } from "@/lib/sdk";
import { MProposal } from "~/lib/api";

const proposalsStore = useProposalsStore();
const proposals = computed(() =>
  proposalsStore.getProposalsByState("Succeeded")
);

const { address: userAccount } = useAccount();
const spog = useSpogStore();
const config = useRuntimeConfig();

function onExecute(proposal: MProposal) {
  const { description, calldatas, proposalType } = proposal;
  const hashedDescription = keccak256(toHex(description));
  const targets = [
    "updateValueQuorumNumerator",
    "updateVoteQuorumNumerator",
  ].includes(proposalType)
    ? [spog.contracts.governor as Hash] // dual governor contract as target for dual governance proposals
    : [config.public.contracts.spog as Hash];
  const values = [BigInt(0)]; // do not change

  return writeIspogGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "execute",
    args: [targets, values, calldatas as Hash[], hashedDescription], // (targets, values, calldatas, hashedDescription
    account: userAccount.value,
    value: BigInt(0),
  }).then(() => {
    console.log("executed");
    window.location.reload();
  });
}
</script>
