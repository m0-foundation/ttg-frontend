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
      {{ currentProposalValues?.[proposal?.proposalType] }}
    </div>
    <div class="uppercase bg-[#00CC9B] text-[#0B0B0B] py-2 pl-6">
      Incoming Change
    </div>
    <div
      id="technical-proposal-incoming-change"
      class="bg-[#003327] text-[#00CC9B] py-2 pl-6"
    >
      <div v-for="param in proposal?.proposalParams" :key="param.name">
        {{
          ["changeTax", "changeTaxRange"].includes(proposal?.proposalType)
            ? formatEther(param)
            : param
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from "viem";
import { MProposal, CurrentProposalValues } from "@/lib/api";

export interface ProposalProps {
  proposal: MProposal;
  currentProposalValues: CurrentProposalValues;
}

const props = defineProps<ProposalProps>();
</script>
