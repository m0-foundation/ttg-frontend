<template>
  <div>
    <MSimpleTable
      class="px-6 lg:px-0"
      :items="filteredProposals"
      :fields="proposalsTableHeader"
    >
      <template #header-left>
        <PageTitle>
          <template #default>All proposals</template>
        </PageTitle>
      </template>
      <template #header-right>
        <div
          class="flex max-lg:overflow-x-scroll gap-3 mt-2 lg:mt-0 font-inter"
        >
          <select
            v-model="selectedType"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xs p-0 px-2 appearance-auto"
          >
            <option value="all" default>All proposal types</option>
            <option
              v-for="option in proposalTypes"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <select
            v-model="selectedEpoch"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xs p-0 px-2 appearance-auto"
          >
            <option :value="0" default>All epochs</option>
            <option
              v-for="option in epochNumbers"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </template>
      <template #cell(epoch)="{ value }">#{{ value }}</template>
      <template #cell(votingType)="{ value }">
        <MIconPower v-if="['Standard', 'Emergency'].includes(value)" />
        <MIconZero v-else-if="['Zero'].includes(value)" />
      </template>
      <template #cell(proposal)="{ item }">
        <div class="lg:flex gap-4 min-w-96">
          <button
            class="underline hover:no-underline text-left"
            @click="() => onViewProposal(item)"
          >
            {{ useParsedDescriptionTitle(item?.description).title }}
          </button>
        </div>
        <p class="text-xs text-grey-500 mt-1">
          {{ item?.proposalLabel }} · Created:
          {{ useDate(item?.timestamp).toFormat("DD.MM.YY") }}
        </p>
      </template>
      <template #cell(type)="{ item }">
        <div class="flex">
          <ProposalTypeBadge :type="item.votingType" :proposal-word="false" />
        </div>
      </template>
      <template #cell(state)="{ value }">
        <ProposalStatus :version="value" />
      </template>
    </MSimpleTable>

    <MDrawer ref="modal" @on-closed="onCloseDrawer">
      <ProposalDetails v-if="showProposal" :proposal-id="currentProposal" />
    </MDrawer>
  </div>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import ProposalStatus from "@/components/proposal/Status.vue";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

const selectedType = ref("all");
const selectedEpoch = ref(0);

const proposalsTableHeader = [
  { key: "epoch", label: "Created Epoch", sortable: true },
  { key: "votingType", label: "Token", sortable: false },
  { key: "proposal", label: "Proposal" },
  { key: "type", label: "Type" },
  { key: "state", label: "Status", sortable: true },
];

const proposalTypes = computed(() => [
  ...new Set(proposals.value.map((obj) => obj.proposalLabel)),
]);

const epochNumbers = computed(() => [
  ...new Set(proposals.value.map((obj) => obj.epoch)),
]);

const filteredProposals = computed(() => {
  let results = proposals.value;

  if (selectedType.value !== "all")
    results = results.filter((obj) => obj.proposalLabel === selectedType.value);

  if (selectedEpoch.value !== 0)
    results = results.filter((obj) => obj.epoch === selectedEpoch.value);

  return results;
});

useHead({
  titleTemplate: "%s - All proposals",
});

const showProposal = ref<boolean>(false);
const currentProposal = ref<string>();
const modal = ref();

async function onViewProposal(proposal: MProposal) {
  const proposalId = proposal.proposalId;
  console.log("onViewProposal", proposalId);
  // do not change this oder;
  await modal.value.close(); //waits for the drawer to unmount
  showProposal.value = false; // force unmount content of drawer
  currentProposal.value = proposalId;
  showProposal.value = true;
  modal.value.open();
  window.history.pushState({}, "", `/proposal/${proposalId}`);
}

function onCloseDrawer() {
  showProposal.value = false;
  currentProposal.value = undefined;
  window.history.replaceState({}, "", "/proposals/all");
}
</script>
