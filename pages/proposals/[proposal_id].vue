<template>
  <LayoutPage>
    <div class="flex w-full space-x-4">
      <div class="w-3/4 bg-white">
        <article class="bg-white text-black p-8 mb-2">
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
              <span class="text-gray-500">YES</span>
              <span class="text-primary text-3xl">70%</span>
            </div>
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">NO</span>
              <span class="text-red text-3xl">30%</span>
            </div>
          </div>

          <MProgressBar width="70%" class="mb-2" />

          <p class="text-xs mb-7">
            <span class="text-white mr-2">60%</span>
            <span class="text-gray-500">OF TOKENS VOTED</span>
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
  middleware: ["auth"],
});

const store = useProposalsStore();
const route = useRoute();

const proposalId = route.params.proposal_id;
const proposal = store.getProposalById(proposalId);
const { html } = useParsedDescription(proposal.description);

// const { client } = useSpog();

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
