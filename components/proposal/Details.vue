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

      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <ProposalVoteProgress
          v-if="proposal?.state !== 'Pending'"
          :tallies="proposal?.tallies"
          :version="proposal?.votingType"
          :power-threshold="powerThreshold"
          :power-total-supply="totalSupplyAt[0]"
          :zero-threshold="zeroThreshold"
          :zero-total-supply="totalSupplyAt[1]"
        />
      </div>

      <div class="text-grey-400 text-xs mt-8 mb-2 truncate w-52 lg:w-full">
        Proposed by
        <NuxtLink :to="`/profile/${proposal?.proposer}/`">
          <u><MAddressAvatar :address="proposal?.proposer" /></u>
        </NuxtLink>
        at Epoch #{{ proposal?.epoch }} - {{ proposalCreatedFormatedDate }}
      </div>

      <div class="markdown-body mb-6" v-html="html"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValuesFormatted"
        class="mb-6"
      />

      <div class="text-green-900 mb-2">
        <h2>Result details</h2>
        <p class="text-xs">
          List of addresses that have voted for or against the current proposal.
        </p>
      </div>

      <ProposalTableVotes :votes="votes?.value" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import { Hash } from "viem";
import { readPowerToken, readZeroToken } from "@/lib/sdk";

export interface ProposalDetailsProps {
  proposalId: string;
}

const props = defineProps<ProposalDetailsProps>();

const store = useProposalsStore();

const proposal = computed(() => store.getProposalById(props.proposalId));
const proposalId = computed(() => props.proposalId);

const { html } = useParsedDescription(proposal?.value?.description || "");

const { address: userAccount } = useAccount();
const spog = useSpogStore();

const { getValuesFormatted: currentProposalValuesFormatted } =
  storeToRefs(spog);

useHead({
  titleTemplate: `%s - Proposal #${proposalId.value}`,
});

console.log({ currentProposalValuesFormatted });

const { toFormat } = useDate(proposal.value!.timestamp!);
const proposalCreatedFormatedDate = computed(() => toFormat("LLL"));

const zeroThreshold = computed(() =>
  basisPointsToDecimal(spog.getValues.zeroProposalThresholdRatio!)
);
const powerThreshold = computed(() =>
  basisPointsToDecimal(spog.getValues.emergencyProposalThresholdRatio!)
);

const votesStore = useVotesStore();
const votes = computed(() => {
  if (proposalId.value) {
    return votesStore.getBy("proposalId", proposalId.value);
  }
});

const { state: totalSupplyAt, isLoading } = useAsyncState(
  Promise.all([
    readPowerToken({
      address: spog!.contracts!.powerToken! as Hash,
      functionName: "pastTotalSupply",
      args: [BigInt(proposal.value!.epoch!) - 1n],
    }),
    readZeroToken({
      address: spog!.contracts!.zeroToken! as Hash,
      functionName: "totalSupply",
    }),
  ]),
  [0n, 0n]
);
</script>
