<template>
  <div data-test="technical-proposal" class="py-4">
    <h3 class="text-xl">Technical Proposal</h3>
    <p class="text-sm text-grey-500 mb-4">
      Agree or deny the following incoming change
    </p>

    <div v-if="currentValue">
      <div
        class="uppercase font-mono bg-[#353835] leading-3 text-[#AEAFAE] text-xs py-2 p-3"
      >
        Current
      </div>
      <div
        id="technical-proposal-current"
        class="bg-[#0B0B0B] text-grey-100 text-sm py-2 p-3"
      >
        {{ currentValue }}
      </div>
    </div>
    <div
      class="font-mono leading-3 bg-[#00CC9B] text-[#0B0B0B] text-xs py-2 p-3 flex justify-between"
    >
      <p class="uppercase">Incoming Change</p>

      <p>
        {{ props.proposal?.proposalLabel }}
      </p>
    </div>
    <div
      id="technical-proposal-incoming-change"
      class="bg-[#003327] text-[#00CC9B] text-sm py-2 p-3"
    >
      <div v-if="showParsed">
        <div v-for="(param, index) in incomingValuesParsed" :key="param">
          <span v-if="param.includes('0x')">{{ param }}</span>
          <span v-else>{{ param }} ({{ incomingValues[index] }})</span>
        </div>
      </div>

      <div v-for="param in incomingValues" v-else :key="param" :title="param">
        <span class="break-words">{{ param }}</span>
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

const parsedIncomingValue = (value: string, type: string) => {
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
    if (typeof value === "bigint") return formatFee(value);
    if (typeof value === "string")
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
  ].includes(props.proposal?.proposalType),
);

const currentValue = computed(() =>
  props.proposal?.proposalType === "setStandardProposalFee"
    ? props.currentProposalValues["setProposalFee"]
    : props.currentProposalValues[
        props.proposal
          ?.proposalType as keyof ProposalProps["currentProposalValues"]
      ],
);

const incomingValues = computed(() => props.proposal?.proposalParams);

const incomingValuesParsed = computed(() =>
  props.proposal?.proposalParams.map((param) =>
    parsedIncomingValue(param, props.proposal?.proposalType),
  ),
);
</script>
