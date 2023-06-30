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
          <ProposalStatus :version="proposal?.state" />

          <div class="text-primary-darker text-sm mb-6">
            Proposed by <u>{{ proposal?.proposer }}</u>
          </div>
          <div class="markdown-body mb-6" v-html="html"></div>

          <ProposalTechnical :proposal="proposal" />
          <!--  -->
          <div
            v-if="proposal?.state === 'Active' && hasDelegator"
            class="flex justify-between items-center bg-gray-200 p-8 mb-2"
          >
            <div class="text-body-dark text-xl mr-4">Delegate vote tokens</div>
            <div class="space-x-1">
              <MButton @click="delegate()">Delegate to me</MButton>
            </div>
          </div>
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

          <div
            v-if="proposal?.state === 'Succeeded'"
            class="flex justify-between items-center bg-gray-200 p-8"
          >
            <div class="text-body-dark text-3xl mr-4">Execute?</div>
            <div class="space-x-1 uppercase">
              <MButton @click="execute()">Yes</MButton>
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
              <span class="text-gray-500">YES </span>
              <span class="text-primary text-3xl"
                >{{ votes?.yes?.percentage }}%</span
              >
            </div>
            <div class="w-1/2 flex flex-col">
              <span class="text-gray-500">NO </span>
              <span class="text-red text-3xl"
                >{{ votes?.no?.percentage }}%</span
              >
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

<script setup>
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import { keccak256, toHex } from "viem";
import { writeIspogGovernor, writeIVoteToken } from "@/lib/sdk";

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
const spog = useSpogStore();
const { epoch } = storeToRefs(spog);

const {
  state: votes,
  isReady,
  isLoading,
} = useAsyncState(client.getProposalVotes(proposalId));

const { state: voters } = useAsyncState(client.getProposalVoters(proposalId));
const { state: hasDelegator } = useAsyncState(
  client
    .getVoteDelegatorFrom(userAccount.value)
    .then(
      (delegator) => delegator === "0x0000000000000000000000000000000000000000"
    )
);

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});

function delegate() {
  console.log({ hasDelegator });
  // no delegate

  return writeIVoteToken({
    address: spog.contracts.vote,
    functionName: "delegate",
    args: [userAccount.value], // self delegate
  });
}

function castVote(vote) {
  return writeIspogGovernor({
    address: spog.contracts.governor,
    functionName: "castVote",
    args: [proposalId, vote], // uint256 proposalId, uint8 support
    account: userAccount.value,
  });
}

function execute() {
  const { description, calldatas } = proposal;
  console.log({ description, calldatas });
  const hashedDescription = keccak256(toHex(description));
  const targets = [config.public.contracts.spog]; // do not change
  const values = [0]; // do not change

  return writeIspogGovernor({
    address: spog.contracts.governor,
    functionName: "execute",
    args: [targets, values, calldatas, hashedDescription], // (targets, values, calldatas, hashedDescription
    account: userAccount.value,
  });
}
</script>
