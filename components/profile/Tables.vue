<template>
  <div class="my-2">
    <!-- tabs -->
    <div class="flex justify-start gap-12 mt-8 mb-1 table-nav">
      <button
        :class="[
          '-tracking-wider',
          selectedTab === 0 ? 'text-grey-200' : 'text-grey-500',
        ]"
        data-test="profile-button-voting-history"
        @click="selectedTab = 0"
      >
        Voting History
      </button>
      <button
        :class="[selectedTab === 1 ? 'text-grey-200' : 'text-grey-500']"
        data-test="profile-button-submitted-proposals"
        @click="selectedTab = 1"
      >
        Submitted Proposals
      </button>
    </div>

    <div v-if="selectedTab === 0">
      <ProfileTableVotes :votes="votes" />
    </div>

    <div v-if="selectedTab === 1">
      <ProfileTableProposals :proposals="proposalsCreated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { MVote } from "@/lib/api/types";

const props = defineProps<{
  address: Ref<Hash>;
}>();

const address = toRef(props, "address");

const selectedTab = ref(0);

let votes = ref<MVote[]>([]);
const proposals = useProposalsStore();
const votesStore = useVotesStore();

watch(
  address,
  () => {
    votes = votesStore.getBy("voter", address.value);
  },
  { immediate: true },
);

const proposalsCreated = computed(() =>
  proposals.getProposalsByProposer(address.value as string),
);
</script>

<style>
.table-nav button {
  @apply font-ppformula;
}
</style>
