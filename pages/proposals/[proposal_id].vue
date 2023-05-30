<template>
  <LayoutPage>
    <div class="flex w-full space-x-4">
      <div class="w-3/4 bg-white">
        <article class="bg-white text-black p-8 mb-2">
          <div>{{ proposalState }}</div>
          <div class="text-primary-darker text-sm mb-6">
            Proposed by <u>{{ proposal.proposer }}</u>
          </div>
          <div class="markdown-body mb-6" v-html="html"></div>

          <div class="flex justify-between items-center bg-gray-200 p-8">
            <div class="text-body-dark text-3xl mr-4">Approve?</div>
            <div class="space-x-1">
              <MButton>YES</MButton>
              <MButton>NO</MButton>
            </div>
          </div>
        </article>
      </div>
      <div class="w-1/4">
        <div class="bg-black p-4">
          <div class="flex justify-between mb-7">
            <div class="text-gray-500 text-xs">VOTES</div>
            <div class="text-white text-xs">12 DAYS LEFT</div>
          </div>

          <div class="flex">
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">YES {{ votes?.yes?.count }}</span>
              <span class="text-primary text-3xl"
                >{{ votes?.yes?.percentage }}%</span
              >
            </div>
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">NO {{ votes?.no?.count }}</span>
              <span class="text-red text-3xl"
                >{{ votes?.no?.percentage }}%</span
              >
            </div>
          </div>

          <MProgressBar :width="votes?.yes?.percentage" class="mb-2" />

          <p class="text-xs mb-7">
            <span class="text-white mr-2">{{ votes?.total }}</span>
            <span class="text-gray-500">TOTAL VOTES</span>
          </p>

          <p class="text-gray-500">RECENT VOTES</p>

          <div class="flex flex-col">
            <div
              v-for="vote in recentVotesList"
              :key="vote.voter"
              class="flex justify-between space-x-2"
            >
              <div class="text-white truncate w-2/3 overflow-hidden">
                {{ vote.voter }}
              </div>
              <div class="text-primary">{{ vote.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
definePageMeta({
  layout: "with-navbar",
});

const store = useProposalsStore();
const route = useRoute();

const proposalId = route.params.proposal_id;
const proposal = store.getProposalById(proposalId);
const { html } = useParsedDescription(proposal.description);

const { client } = useSpog();
const {
  state: votes,
  isReady,
  isLoading,
} = useAsyncState(client.getProposalVotes(proposalId));
console.log({ votes, isReady, isLoading });

const { state: proposalState } = useAsyncState(
  client.getProposalState(proposalId)
);

// mock
const recentVotesList = [
  {
    voter: "0x123456789098765432",
    amount: "1.56%",
  },
  {
    voter: "0x23456789098765432",
    amount: "1.56%",
  },
  {
    voter: "0x3456789098765432",
    amount: "0.56%",
  },
];
</script>
