<template>
  <div>
    <slot v-if="!hasProposals" name="emptyState"></slot>
    <div v-for="proposal in proposals" v-else :key="proposal.proposalId">
      <ProposalCard :loading="loading" :proposal="proposal" v-bind="$attrs" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MProposal } from '@/lib/api/types'

  export interface ProposalListProps {
    proposals: MProposal[]
    loading: boolean
  }

  const props = defineProps<ProposalListProps>()
  const { proposals } = toRefs(props)

  const hasProposals = computed(
    () => proposals.value && proposals.value.length > 0,
  )
</script>
