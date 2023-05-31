<template>
  <LayoutPage>
    <div class="flex w-full space-x-4">
      <div class="w-3/4 bg-white">
        <article class="bg-white text-black p-8 mb-2">
          <div>{{ proposal?.state }}</div>
          <div class="text-primary-darker text-sm mb-6">
            Proposed by <u>{{ proposal?.proposer }}</u>
          </div>
          <div class="markdown-body mb-6" v-html="html"></div>
          <!--  -->
          <div
            v-if="proposal?.state === 'Active'"
            class="flex justify-between items-center bg-gray-200 p-8"
          >
            <div class="text-body-dark text-3xl mr-4">Approve?</div>
            <div class="space-x-1">
              <MButton @click="castVote(1)">YES</MButton>
              <MButton @click="castVote(0)">NO</MButton>
            </div>
          </div>
        </article>
      </div>

      <div v-if="proposal?.state !== 'Pending'" class="w-1/4">
        <div class="bg-black p-4">
          <div class="flex justify-between mb-7">
            <div class="text-white text-xs">{{ timeLeft }}</div>
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

          <p class="text-gray-500">VOTES</p>

          <div class="flex flex-col">
            <div
              v-for="vote in voters"
              :key="vote.voter"
              class="flex justify-between space-x-2"
            >
              <a
                :href="`https://sepolia.etherscan.io/tx/${vote.transactionHash}`"
                class="text-white truncate w-2/3 overflow-hidden underline"
              >
                {{ vote.voter }}
              </a>
              <div :class="vote.support ? 'text-primary' : 'text-red'">
                {{ vote.support ? "YES" : "NO" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutPage>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import { writeGovernor } from "@/lib/generated";

definePageMeta({
  layout: "with-navbar",
});

const store = useProposalsStore();
const route = useRoute();

const proposalId = route.params.proposal_id;
const proposal = store.getProposalById(proposalId);
const { html } = useParsedDescription(proposal.description);

const config = useRuntimeConfig();
const { address: userAccount } = useAccount();
const { client } = useSpogClientStore();
const spogStateStore = useSpogStateStore();
const { epoch } = storeToRefs(spogStateStore);

const {
  state: votes,
  isReady,
  isLoading,
} = useAsyncState(client.getProposalVotes(proposalId));
console.log({ votes, isReady, isLoading });

const { state: voters } = useAsyncState(client.getProposalVoters(proposalId));

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});

function castVote(vote) {
  return writeGovernor({
    address: config.contracts.governor.vote,
    functionName: "castVote",
    args: [proposalId, vote], // uint256 proposalId, uint8 support
    account: userAccount.value,
    chainId: 11155111,
    overrides: {
      gasLimit: 2100000n,
    },
  });
}

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
