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
        class="uppercase flex text-xs items-center hover:underline"
        :to="`/proposals/${proposal.proposalId}`"
      >
        <img src="/img/icon-show-details.svg" class="h-4 mr-2" />
        show details
      </NuxtLink>

      <div class="flex justify-between items-center">
        <ProposalStatus :version="proposal?.state" />

        <div class="inline-flex gap-1 ml-4" role="group">
          <ProposalButtonCastVote
            :disabled="isCastVoteYesDisabled"
            @click="onCastSelected(1)"
          >
            YES
          </ProposalButtonCastVote>
          <ProposalButtonCastVote
            :disabled="isCastVoteNoDisabled"
            @click="onCastSelected(0)"
          >
            NO
          </ProposalButtonCastVote>
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
const emit = defineEmits<{
  (e: "on-cast", vote: number, proposaId: string): void;
  (e: "on-uncast", proposaId: string): void;
}>();

const { toFormat, timeAgo } = useDate(props.proposal.timestamp);

const formatedDate = computed(() => toFormat("LL"));

const { title } = useParsedDescriptionTitle(props.proposal.description);

const isVoteSelected = ref(false);
const selectedVote = ref<null | number>(null);
const isCastVoteYesDisabled = computed(() => selectedVote.value === 0);
const isCastVoteNoDisabled = computed(() => selectedVote.value === 1);

function onCastSelected(vote: number) {
  if (isVoteSelected.value) {
    emit("on-uncast", props.proposal.proposalId);
    isVoteSelected.value = false;
    selectedVote.value = null;
  } else {
    emit("on-cast", vote, props.proposal.proposalId);
    isVoteSelected.value = true;
    selectedVote.value = vote;
  }
}
</script>

<style scoped></style>
