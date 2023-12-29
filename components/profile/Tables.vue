<template>
  <div class="my-2">
    <!-- tabs -->
    <div class="flex justify-start gap-12 bg-[#1b1c1b] px-6 py-8">
      <button
        :class="[
          'uppercase hover:underline text-xs ',
          selectedTab === 0 ? 'text-white' : 'text-zinc-500',
        ]"
        data-test="profile-button-voting-history"
        @click="selectedTab = 0"
      >
        voting history
      </button>
      <button
        :class="[
          'uppercase hover:underline text-xs',
          selectedTab === 1 ? 'text-white' : 'text-zinc-500',
        ]"
        data-test="profile-button-submitted-proposals"
        @click="selectedTab = 1"
      >
        submitted proposals
      </button>
    </div>

    <div v-if="selectedTab === 0" class="p-4">
      <ProfileTableVotes :votes="votes" />
    </div>

    <div v-if="selectedTab === 1" class="p-4">
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
  { immediate: true }
);

const proposalsCreated = computed(() =>
  proposals.getProposalsByProposer(address.value as string)
);
</script>
