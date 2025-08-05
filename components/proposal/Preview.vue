<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="bg-white mb-3 text-black pb-4">
    <div
      class="bg-slate-200 text-slate-700 number text-sm px-2 py-1 tracking-[1px]">
      PREVIEW
    </div>
    <div class="p-6">
      <ProposalTypeBadge
        v-if="proposal.votingType !== 'Standard'"
        :type="proposal.votingType" />

      <MBadge v-if="proposal?.votingType === 'Zero'">ZERO proposal</MBadge>

      <h2 class="text-[28px] text-grey-1000 font-light leading-10 my-2">
        {{ title }}
      </h2>

      <div
        class="text-grey-600 mb-6 font-inter text-sm truncate w-52 lg:w-full">
        Proposed by
        <u><MAddressAvatar :address="proposal?.proposer" /></u>
      </div>

      <div class="markdown-body my-8" v-html="onlyDescriptionHtml"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValuesFormatted" />
    </div>
  </article>
</template>

<script setup lang="ts">
  import { MProposal } from '@/lib/api/types'

  interface PreviewProps {
    title: string
    proposal: MProposal
  }

  const props = defineProps<PreviewProps>()

  const ttg = useTtgStore()
  const { getValuesFormatted: currentProposalValuesFormatted } =
    storeToRefs(ttg)
  const { onlyDescriptionHtml } = useParsedDescriptionTitle(
    props.proposal?.description,
  )
</script>

<style scoped>
  .markdown-body {
    box-sizing: border-box;
  }
</style>
