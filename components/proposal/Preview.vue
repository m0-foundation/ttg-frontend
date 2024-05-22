<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div>
      <button
        class="text-green-800 uppercase mb-4"
        data-test="create-proposal-button-back-top"
        @click="onBack"
      >
        &#60; back
      </button>
    </div>
    <h1>Preview your proposal</h1>

    <MTextLoop class="text-green-900 bg-green-700 text-sm" text="PREVIEW" />

    <article class="bg-white mb-3 text-black px-4 py-4">
      <MBadge v-if="proposal?.isEmergency" version="error">
        Emergency proposal
      </MBadge>

      <MBadge v-if="proposal?.votingType === 'Zero'"> Zero proposal </MBadge>

      <h2 class="text-[28px] text-grey-1000 font-light leading-10 my-3">
        {{ title }}
      </h2>

      <div
        class="text-grey-400 my-1 font-inter text-xs truncate w-52 lg:w-full"
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
const emit = defineEmits(["on-back"]);

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

function onBack() {
  // emit isPreview
  emit("on-back");
}
</script>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

.markdown-body {
  box-sizing: border-box;
}
</style>
