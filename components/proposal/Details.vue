<template>
  <div>
    <article class="bg-white text-black px-4 py-4">
      <div class="flex justify-between mb-2">
        <ProposalStatusTimeline
          :proposal="proposal"
          :version="proposal?.state"
        />
        <div>
          <ProposalMenu :proposal="proposal" />
        </div>
      </div>

      <MBadge
        v-if="proposal?.isEmergency"
        class="uppercase text-[10px]"
        version="error"
        >Emergency Proposal</MBadge
      >

      <h1 class="text-[28px] my-2 text-grey-1000 font-light leading-10">
        {{ title }}
      </h1>

      <div class="text-grey-400 font-light text-xs truncate w-52 lg:w-full">
        Proposed by
        <NuxtLink :to="`/profile/${proposal?.proposer}/`">
          <u><MAddressAvatar :address="proposal?.proposer" /></u>
        </NuxtLink>
        at Epoch #{{ proposal?.epoch }} - {{ proposalCreatedFormatedDate }}
      </div>

      <div v-if="isLoading" class="h-4">Loading...</div>
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

      <div class="markdown-body mb-6" v-html="onlyDescription"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValuesFormatted"
      />

      <div v-if="votes?.value.length" class="mt-8">
        <div class="text-grey-900">
          <h2 class="text-xl">Voters</h2>
        </div>

        <ProposalTableVotes :votes="votes?.value" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { readPowerToken, readZeroToken } from "@/lib/sdk";

export interface ProposalDetailsProps {
  proposalId: string;
}

const props = defineProps<ProposalDetailsProps>();

const store = useProposalsStore();

const proposal = computed(() => store.getProposalById(props.proposalId));
const proposalId = computed(() => props.proposalId);

const { onlyDescription, title } = useParsedDescriptionTitle(
  proposal?.value?.description || ""
);

const spog = useSpogStore();

const { getValuesFormatted: currentProposalValuesFormatted } =
  storeToRefs(spog);

useHead({
  titleTemplate: `%s - Proposal #${proposalId.value}`,
});

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

console.log("VOTES", votes.value?.value);

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
