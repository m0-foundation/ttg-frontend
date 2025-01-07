<template>
  <section>
    <PageTitle title="History" />
    <UContainer class="py-4">
      <div class="flex gap-3">
        <USelectMenu
          v-model="selectedType"
          class="h-[32px] w-[170px] text-xs"
          :options="proposalTypes"
          placeholder="All types"
          multiple
        />
        <USelectMenu
          v-model="selectedEpoch"
          class="h-[32px] w-[170px] text-xs"
          :options="epochNumbers"
          placeholder="All epochs"
          multiple
          searchable
        />
      </div>
      <MSimpleTable
        class="max-lg:overflow-x-scroll"
        :items="filteredProposals"
        :fields="proposalsTableHeader"
      >
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
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import ProposalStatus from "@/components/proposal/Status.vue";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

const selectedType = ref([]);
const selectedEpoch = ref([]);

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

  if (selectedType.value.length)
    results = results.filter((obj) =>
      selectedType.value.includes(obj.proposalLabel),
    );

  if (selectedEpoch.value.length)
    results = results.filter((obj) => selectedEpoch.value.includes(obj.epoch));

  return results;
});

useHead({
  titleTemplate: "%s - All proposals",
});

async function onViewProposal(proposal: MProposal) {
  await navigateTo(`/proposal/${proposal.proposalId}`);
}
</script>
