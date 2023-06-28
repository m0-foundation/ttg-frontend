<template>
  <div>
    <h1 class="text-[#00664E] text-lg">
      Technical Proposal: {{ proposal.proposalLabel || proposal.proposalType }}
    </h1>
    <h2 class="text-sm pt-2 pb-6">
      Agree or deny the following incoming change
    </h2>
    <div class="uppercase bg-[#353835] text-[#AEAFAE] py-2 pl-6">Current</div>
    <div class="bg-[#0B0B0B] text-white py-2 pl-6">...</div>
    <div class="uppercase bg-[#00CC9B] text-[#0B0B0B] py-2 pl-6">
      Incoming Change
    </div>
    <div class="bg-[#003327] text-[#00CC9B] py-2 pl-6">
      <div v-for="param in proposal.proposalParams" :key="param.name">
        {{ param }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api";

export interface ProposalProps {
  proposal: MProposal;
}

const props = defineProps<ProposalProps>();
console.log(props.proposal);
</script>
