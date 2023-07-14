<template>
  <article class="bg-white text-black p-8 mb-2">
    <h2 class="text-4xl mb-4">
      {{ title }}
    </h2>
    <div class="text-primary-darker text-sm mb-6 flex justify-between">
      <div>
        Proposed by <u>{{ proposal.proposer }}</u>
      </div>
      <div>{{ timeAgo }} | {{ formatedDate }}</div>
    </div>
    <div class="flex justify-between uppercase">
      <NuxtLink
        class="uppercase border-b border-black border-dashed hover:border-0"
        :to="`/proposals/${proposal.proposalId}`"
      >
        show details
      </NuxtLink>

      <div class="flex justify-between items-center">
        <ProposalStatus :version="proposal?.state" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api";

export interface ProposalCardProps {
  proposal: MProposal;
}

const props = defineProps<ProposalCardProps>();

const { toFormat, timeAgo } = useDate(props.proposal.timestamp);

const formatedDate = computed(() => toFormat("LL"));

const { title } = useParsedDescriptionTitle(props.proposal.description);
</script>

<style scoped></style>
