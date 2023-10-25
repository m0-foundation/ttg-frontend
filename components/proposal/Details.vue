<template>
  <div>
    <MTextLoop
      v-show="proposal?.isEmergency"
      class="text-white bg-[#CC0000] text-xs"
      text="EMERGENCY_VOTING"
    />

    <article class="bg-white text-black px-8 py-4">
      <ProposalStatusTimeline :version="proposal?.state" />

      <ProposalVoteProgress
        v-if="proposal?.state !== 'Pending'"
        :votes="proposal?.votes"
        :version="proposal?.votingType"
        :zero-quorum="zeroQuorum"
        :power-quorum="powerQuorum"
      />

      <div class="flex justify-between mb-7">
        <div class="text-white text-xs">{{ timeLeft }}</div>
      </div>

      <div class="text-primary-darker text-sm mb-6 truncate w-52 lg:w-full">
        Proposed by
        <NuxtLink :to="`/profile/${proposal?.proposer}/`">
          <u>{{ proposal?.proposer }}</u>
        </NuxtLink>
      </div>

      <div class="markdown-body mb-6" v-html="html"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValues"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount, useContractRead } from "use-wagmi";
import { Hash } from "viem";
import { dualGovernorABI } from "@/lib/sdk";

export interface ProposalDetailsProps {
  proposalId: string;
}

const props = defineProps<ProposalDetailsProps>();

const store = useProposalsStore();

const proposal = store.getProposalById(props.proposalId);

const proposalId = computed(() => proposal?.proposalId);
const { html } = useParsedDescription(proposal?.description || "");

const { address: userAccount } = useAccount();
const spog = useSpogStore();
const { epoch, getValues: currentProposalValues } = storeToRefs(spog);

const {
  data: hasVoted,
  isError: hasVotedError,
  isLoading: hasVotedLoading,
} = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: dualGovernorABI,
  functionName: "hasVoted",
  args: [BigInt(proposalId.value), userAccount as Ref<Hash>],
  watch: true,
  onSuccess(hasVoted) {
    console.log({ hasVoted });
  },
});

console.log({ currentProposalValues });

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});

const zeroQuorum = computed(
  () => Number(spog.values.zeroTokenQuorumRatio) / 100 / 100 // convert from basis points to 0-1 percentage range
);
const powerQuorum = computed(
  () => Number(spog.values.powerTokenQuorumRatio) / 100 / 100 // convert from basis points to 0-1 percentage range
);
</script>
