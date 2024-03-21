<template>
  <MTabs class="my-2">
    <MTab title="Voting History">
      <ProfileTableVotes :votes="votes" />
    </MTab>
    <MTab title="Submitted Proposals">
      <ProfileTableProposals :proposals="proposalsCreated" />
    </MTab>
  </MTabs>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { MVote } from "@/lib/api/types";

const props = defineProps<{
  address: Ref<Hash>;
}>();

const address = toRef(props, "address");

let votes = ref<MVote[]>([]);
const proposals = useProposalsStore();
const votesStore = useVotesStore();

watch(
  address,
  () => {
    votes = votesStore.getBy("voter", address.value);
  },
  { immediate: true }
);

const proposalsCreated = computed(() =>
  proposals.getProposalsByProposer(address.value as string)
);
</script>
