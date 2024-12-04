<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <PageTitle class="px-6 lg:p-0 mb-3"> Preview your proposal </PageTitle>

    <article class="bg-white mb-3 text-black px-4 py-4">
      <ProposalTypeBadge
        v-if="proposal.votingType !== 'Standard'"
        :type="proposal.votingType"
      />

      <MBadge v-if="proposal?.votingType === 'Zero'"> Zero proposal </MBadge>

      <h2 class="text-[28px] text-grey-1000 font-light leading-10 my-3">
        {{ title }}
      </h2>

      <div
        class="text-grey-500 my-1 font-inter text-xs truncate w-52 lg:w-full"
      >
        Proposed by
        <u><MAddressAvatar :address="proposal?.proposer" /></u>
      </div>

      <div class="markdown-body mb-8" v-html="onlyDescriptionHtml"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValuesFormatted"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";

interface PreviewProps {
  title: string;
  proposal: MProposal;
}

const props = defineProps<PreviewProps>();

const ttg = useTtgStore();
const { getValuesFormatted: currentProposalValuesFormatted } = storeToRefs(ttg);
const { onlyDescriptionHtml } = useParsedDescriptionTitle(
  props.proposal?.description,
);
</script>

<style scoped>
.markdown-body {
  box-sizing: border-box;
}
</style>
