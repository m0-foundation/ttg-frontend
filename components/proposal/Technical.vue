<template>
  <div data-test="technical-proposal">
    <h3 class="text-xl">Technical Proposal</h3>
    <p class="text-sm font-inter mb-4">
      Agree or deny the following incoming change
    </p>
    <div v-if="currentValue">
      <div
        class="uppercase font-mono bg-[#353835] leading-3 text-[#AEAFAE] text-xs py-2 pl-6"
      >
        Current
      </div>
      <div
        id="technical-proposal-current"
        class="bg-[#0B0B0B] text-grey-100 text-sm py-2 pl-6"
      >
        {{ currentValue }}
      </div>
    </div>
    <div
      class="uppercase font-mono leading-3 bg-[#00CC9B] text-[#0B0B0B] text-xs py-2 pl-6"
    >
      Incoming Change
    </div>
    <div
      id="technical-proposal-incoming-change"
      class="bg-[#003327] text-[#00CC9B] text-sm py-2 pl-6"
    >
      <div v-if="showParsed">
        <div v-for="(param, index) in incomingValuesParsed" :key="param">
          <span v-if="param.includes('0x')">{{ param }}</span>
          <span v-else>{{ param }} ({{ incomingValues[index] }})</span>
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
    setEmergencyProposalThresholdRatio: string;
    setZeroProposalThresholdRatio: string;
    setCashToken: string;
  };
}

const props = defineProps<ProposalProps>();

const parsedValue = (value: string, type: string) => {
  const formatFee = (value: string) => useFormatCash(value);

  if (["setProposalFee", "setStandardProposalFee"].includes(type)) {
    return formatFee(value);
  }

  if (
    [
      "setEmergencyProposalThresholdRatio",
      "setZeroProposalThresholdRatio",
    ].includes(type)
  ) {
    return `${basisPointsToPercentage(value)}%`;
  }

  if (["setCashToken"].includes(type)) {
    // when is the address or is the fee
    return value.includes("0x") ? value : formatFee(value);
  }

  return value;
};

const showParsed = computed(() =>
  [
    "setProposalFee",
    "setStandardProposalFee",
    "setEmergencyProposalThresholdRatio",
    "setZeroProposalThresholdRatio",
    "setCashToken",
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
