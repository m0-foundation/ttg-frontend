<template>
  <LayoutPage>
    <div class="flex w-full space-x-4">
      <div class="w-3/4 bg-white">
        <MTextLoop
          v-show="proposal?.isEmergency"
          class="text-white bg-[#CC0000] text-xs"
          text="EMERGENCY_VOTING"
        />

        <article class="bg-white text-black p-8 mb-2">
          <ProposalStatus id="proposal-state" :version="proposal?.state" />

          <div class="text-primary-darker text-sm mb-6 truncate w-52 lg:w-full">
            Proposed by <u>{{ proposal?.proposer }}</u>
          </div>
          <div class="markdown-body mb-6" v-html="html"></div>

          <ProposalTechnical
            :proposal="proposal"
            :current-proposal-values="currentProposalValues"
          />
        </article>
      </div>

      <div v-if="proposal?.state !== 'Pending'" class="w-1/4">
        <div class="bg-black p-4">
          <div class="flex justify-between mb-7">
            <div class="text-white text-xs">{{ timeLeft }}</div>
          </div>

          <div class="flex">
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">YES</span>
              <span id="vote-yes-percentage" class="text-primary text-3xl">
                {{ votes?.yes?.percentage }}%
              </span>
            </div>
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">NO</span>
              <span id="vote-no-percentage" class="text-red text-3xl">
                {{ votes?.no?.percentage }}%
              </span>
            </div>
          </div>

          <MProgressBar :width="votes?.yes?.percentage" class="mb-2" />

          <!-- <p class="text-xs mb-7">
            <span class="text-white mr-2">{{ votes?.total }}</span>
            <span class="text-gray-500">TOTAL VOTES</span>
          </p> -->

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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount, useContractRead } from "use-wagmi";
import { Hash } from "viem";
import { writeIspogGovernor, ispogGovernorABI } from "@/lib/sdk";

const store = useProposalsStore();
const route = useRoute();

const proposalId = route.params.proposal_id as string;
const proposal = store.getProposalById(proposalId);
console.log({ proposal });
const { html } = useParsedDescription(proposal?.description || "");

const config = useRuntimeConfig();
const { address: userAccount } = useAccount();
const { client } = useSpogClientStore();
const spog = useSpogStore();
const { epoch } = storeToRefs(spog);

const {
  data: votes = [0n, 0n],
  isError,
  isLoading,
} = useContractRead({
  address: spog.contracts.governor,
  abi: ispogGovernorABI,
  functionName: "proposalVotes",
  args: [BigInt(proposalId)],
  watch: true,
  select: (data) => client.parseProposalVotes(data),
  onSuccess(data) {
    console.log("Fetched votes for proposal", proposalId, data);
  },
});

const {
  data: hasVoted,
  isError: hasVotedError,
  isLoading: hasVotedLoading,
} = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: ispogGovernorABI,
  functionName: "hasVoted",
  args: [
    BigInt(proposalId),
    (userAccount.value || config.public.ZERO_ADDRESS) as Hash,
  ],
  watch: true,
  onSuccess(hasVoted) {
    console.log({ hasVoted });
  },
});

const { state: currentProposalValues } = useAsyncState(
  client.getCurrentProposalValues(),
  null
);
console.log({ currentProposalValues });

const { state: voters } = useAsyncState(
  client.getProposalVoters(proposalId),
  null
);
console.log({ voters });

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});
</script>
