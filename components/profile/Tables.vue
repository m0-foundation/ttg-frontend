<template>
  <div class="my-8">
    <!-- tabs -->
    <div class="flex justify-start gap-12 bg-[#1b1c1b] px-4 py-8">
      <button
        :class="[
          'uppercase hover:underline text-xs',
          { underline: selectedTab === 0 },
        ]"
        @click="selectedTab = 0"
      >
        voting history
      </button>
      <button
        :class="[
          'uppercase hover:underline text-xs',
          { underline: selectedTab === 1 },
        ]"
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
const apiStore = useApiClientStore();

watch(
  address,
  () => {
    const { state } = useAsyncState(
      apiStore.client.governor!.voting!.getVotesByVoter(
        address.value as string
      ),
      []
    );
    votes = state;
  },
  { immediate: true }
);

const proposalsCreated = computed(() =>
  proposals.getProposalsByProposer(address.value as string)
);
</script>
