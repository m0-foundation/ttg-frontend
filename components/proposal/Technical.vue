<template>
  <div data-test="technical-proposal">
    <h1 class="text-[#00664E] text-lg">
      Technical Proposal: {{ proposal?.proposalLabel }}
    </h1>
    <h2 class="text-sm pt-2 pb-6">
      Agree or deny the following incoming change
    </h2>
    <div class="uppercase bg-[#353835] text-[#AEAFAE] py-2 pl-6">Current</div>
    <div
      id="technical-proposal-current"
      class="bg-[#0B0B0B] text-white py-2 pl-6"
    >
      {{ currentValue }}
    </div>
    <div class="uppercase bg-[#00CC9B] text-[#0B0B0B] py-2 pl-6">
      Incoming Change
    </div>
    <div
      id="technical-proposal-incoming-change"
      class="bg-[#003327] text-[#00CC9B] py-2 pl-6"
    >
      <div v-if="showParsed">
        <div v-for="(param, index) in incomingValuesParsed" :key="param">
          {{ param }} ({{ incomingValues[index] }})
        </div>
      </div>

      <div v-for="param in incomingValues" v-else :key="param">
        {{ param }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";

export interface ProposalProps {
  proposal: MProposal;
  currentProposalValues: {
    setProposalFee: string;
    setProposalFeeRange: string[];
    setPowerTokenQuorumRatio: string;
    setZeroTokenQuorumRatio: string;
  };
}

const props = defineProps<ProposalProps>();

const parsedValue = (value: string, type: string) => {
  const formatFee = (value: string) => useFormatCash(value);

  if (type === "setProposalFee") {
    return formatFee(value);
  }
  if (type === "setProposalFeeRange") {
    return formatFee(value);
  }

  if (["setPowerTokenQuorumRatio", "setZeroTokenQuorumRatio"].includes(type)) {
    return `${basisPointsToPercentage(value)}%`;
  }

  return value;
};

const showParsed = computed(() =>
  [
    "setProposalFee",
    "setProposalFeeRange",
    "setPowerTokenQuorumRatio",
    "setZeroTokenQuorumRatio",
  ].includes(props.proposal?.proposalType)
);

const currentValue = computed(
  () =>
    props.currentProposalValues[
      props.proposal
        ?.proposalType as keyof ProposalProps["currentProposalValues"]
    ]
);

const incomingValues = computed(() => props.proposal?.proposalParams);

const incomingValuesParsed = computed(() =>
  props.proposal?.proposalParams.map((param) =>
    parsedValue(param, props.proposal?.proposalType)
  )
);
</script>
