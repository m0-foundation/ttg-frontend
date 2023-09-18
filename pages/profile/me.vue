<template>
  <div v-if="userAccount">
    <h1 class="text-2xl uppercase">
      my profile<span class="text-primary">_</span>
    </h1>
    <div class="flex justify-between gap-4">
      <div>
        <p class="text-grey-primary text-xs uppercase">voting address</p>
        <p class="text-grey-primary text-md">
          {{ userAccount }}
        </p>
      </div>
      <div>
        <MButton>
          <NuxtLink to="/delegate">re-delegate</NuxtLink>
        </MButton>
      </div>
    </div>
    <div class="flex justify-between gap-8 my-8">
      <!-- power tokens -->
      <div class="flex w-full justify-between">
        <div>
          <p class="uppercase text-xs">balance power tokens</p>
          <p class="text-4xl inline-flex items-center my-2">
            <MIconPower class="h-8 w-8 mr-4" />
            {{ powerToken?.data.value?.formatted }}
          </p>
        </div>

        <div>
          <p class="uppercase text-xs text-grey-primary">Epoch Voting Power</p>
          <p class="text-4xl inline-flex items-center my-2">
            {{ powerTokenVotingPower?.data.value }}
          </p>
        </div>
      </div>
      <div class="flex border-r border-r-primary-darker mx-2"></div>
      <!-- zero tokens -->
      <div class="flex w-full justify-between">
        <div>
          <p class="uppercase text-xs">balance zero tokens</p>
          <p class="text-4xl inline-flex items-center my-2">
            <MIconZero class="h-8 w-8 mr-4" />
            {{ zeroToken?.data.value?.formatted }}
          </p>
        </div>

        <div>
          <p class="uppercase text-xs text-grey-primary">Epoch Voting Power</p>
          <p class="text-4xl inline-flex items-center my-2">
            {{ zeroTokenVotingPower?.data?.value }}
          </p>
        </div>
      </div>
    </div>
    <!-- tables -->
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
        <div
          v-if="!votes || !votes.length"
          class="flex flex-col items-center justify-center h-80 text-grey-primary"
        >
          No voting history to show.
        </div>
        <MTable v-else :config="votesTableConfig" />
      </div>

      <div v-if="selectedTab === 1" class="p-4">
        <div
          v-if="!proposalsCreated || !proposalsCreated.length"
          class="flex flex-col items-center justify-center h-80 text-grey-primary"
        >
          No proposals created by you.
        </div>
        <MTable v-else :config="proposalsTableConfig" />
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-primary"
  >
    User not conntecd
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import { useAccount } from "use-wagmi";
import ProposalStatus from "@/components/proposal/Status.vue";
import { MProposal, VoteCast } from "@/lib/api";
import { useMBalances, useMVotingPower } from "@/lib/hooks";

const { address: userAccount } = useAccount();

const selectedTab = ref(0);
let votes = ref<VoteCast[]>([]);
const proposals = useProposalsStore();
const spogClient = useSpogClientStore();

watch(
  userAccount,
  () => {
    const { state } = useAsyncState(
      spogClient.client.getVotesByVoter(userAccount.value as string),
      []
    );
    votes = state;
  },
  { immediate: true }
);

const proposalsCreated = computed(() =>
  proposals.getProposalsByProposer(userAccount.value as string)
);

const proposalsTableConfig = computed(() => {
  return {
    columns: [
      {
        id: "proposalId",
        hidden: true,
      },
      {
        id: "proposal",
        name: "Proposal",
        sort: true,
        formatter: (cell: string, row: any) => {
          const { title } = useParsedDescriptionTitle(cell);
          return html(
            `<a href="/proposal/${row.cells[0].data}" class="underline">${title}</a>`
          );
        },
      },

      {
        id: "action",
        name: "Action",
        sort: true,
        formatter: (cell: string) =>
          html(`<span class="text-xs text-grey-primary">${cell}</span>`),
      },
      {
        id: "created",
        name: "Created",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-primary">${formatedDate}</span>`
          );
        },
      },
      {
        id: "status",
        name: "Status",
        sort: true,
        formatter: (cell: string) =>
          html(useComponentToHtml(ProposalStatus, { version: cell }).html),
      },
    ],
    data: proposalsCreated.value.map((p) => ({
      proposalId: p.proposalId,
      proposal: p.description,
      action: p.proposalLabel,
      status: p.state,
      created: p.timestamp,
    })),
    search: true,
  };
});

const votesTableConfig = computed(() => {
  return {
    columns: [
      {
        id: "proposalId",
        hidden: true,
      },

      {
        id: "proposal",
        name: "Proposal",
        sort: true,
        formatter: (proposal: MProposal) => {
          const { title } = useParsedDescriptionTitle(proposal.description);
          return html(
            `<a href="/proposal/${proposal.proposalId}" class="underline">${title}</a>`
          );
        },
      },

      {
        id: "vote",
        name: "vote",
        sort: true,
        formatter: (vote: boolean) => {
          return html(
            vote
              ? "<span class='bg-primary text-body-black px-2 py-1'>YES</span>"
              : "<span class='bg-red text-white px-2 py-1'>NO</span>"
          );
        },
      },

      {
        id: "castedAt",
        name: "Casted at",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-primary">${formatedDate}</span>`
          );
        },
      },
    ],
    data: votes.value.map((v: VoteCast) => ({
      proposalId: v.proposalId,
      proposal: proposals.getProposalById(v.proposalId),
      vote: v.support,
      weight: v.weight,
      transactionHash: v.transactionHash,
      castedAt: v.timestamp,
    })),
    search: true,
  };
});

const { powerToken, zeroToken } = useMBalances(userAccount);
const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(userAccount);
</script>
