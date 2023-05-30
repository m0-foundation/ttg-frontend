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
    <div class="markdown-body mb-6" v-html="descriptionShort"></div>
    <div class="flex justify-between uppercase">
      <NuxtLink
        class="uppercase border-b border-black border-dashed"
        :to="`/proposals/${proposal.proposalId}`"
      >
        Show Details
      </NuxtLink>

      <div class="flex justify-between items-center">
        <div class="text-primary-darker text-sm mr-4">
          {{ proposal.state }}
        </div>
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

const { format, timeAgo } = useDate(props.proposal.timestamp);

const formatedDate = computed(() => format("LL"));

const { html } = useParsedDescription(props.proposal.description);
const domParser = new DOMParser();

const title = computed(() => {
  const dom = domParser.parseFromString(html, "text/html");
  const titleHtml = dom.getElementsByTagName("h1")[0];
  if (titleHtml) {
    return titleHtml.innerHTML;
  }
  return "";
});

const descriptionShort = computed(() => {
  const dom = domParser.parseFromString(html, "text/html");
  const descriptionHtml = dom.getElementsByTagName("p")[0];
  if (descriptionHtml) {
    return descriptionHtml.innerHTML;
  }
  return "";
});
</script>

<style scoped></style>
