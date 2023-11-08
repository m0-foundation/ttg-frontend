<template>
  <div>
    <MTextLoop
      v-show="proposal?.isEmergency"
      class="text-white bg-[#CC0000] text-xs"
      text="EMERGENCY_VOTING"
    />

    <article class="bg-white text-black px-4 py-4">
      <div class="flex justify-between">
        <ProposalStatusTimeline
          :proposal="proposal"
          :version="proposal?.state"
        />
        <div>
          <ProposalMenu :proposal="proposal" />
        </div>
      </div>

      <ProposalVoteProgress
        v-if="proposal?.state !== 'Pending'"
        :votes="proposal?.votes"
        :version="proposal?.votingType"
        :zero-quorum="zeroQuorum"
        :power-quorum="powerQuorum"
      />

      <div class="text-grey-400 text-xs mt-8 mb-2 truncate w-52 lg:w-full">
        Proposed by
        <NuxtLink :to="`/profile/${proposal?.proposer}/`">
          <u>{{ shortenAddress(proposal?.proposer) }}</u>
        </NuxtLink>
        at Epoch #{{ proposal?.epoch }} - {{ proposalCreatedFormatedDate }}
      </div>

      <div class="markdown-body mb-6" v-html="html"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValues"
      />
    </article>

    <div class="my-8">
      <ProposalTableVotes :votes="votes?.value" />
    </div>
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

const { toFormat } = useDate(proposal?.timestamp);
const proposalCreatedFormatedDate = computed(() => toFormat("LL"));

const zeroQuorum = computed(() =>
  basisPointsToDecimal(spog.values.zeroTokenQuorumRatio!)
);
const powerQuorum = computed(() =>
  basisPointsToDecimal(spog.values.powerTokenQuorumRatio!)
);

const votesStore = useVotesStore();
const votes = computed(() => {
  if (proposalId.value) {
    return votesStore.getBy("proposalId", proposalId.value);
  }
});
</script>
