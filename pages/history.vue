<template>
  <section>
    <PageTitle title="Proposals" />
    <UContainer class="py-4">
      <div class="flex gap-3">
        <USelectMenu
          v-model="selectedType"
          class="h-[32px] w-[190px] text-xs"
          :options="proposalTypes"
          placeholder="All types"
          multiple
        />
        <USelectMenu
          v-model="selectedEpoch"
          class="h-[32px] w-[120px] text-xs"
          :options="epochNumbers"
          placeholder="All epochs"
          multiple
          searchable
        />
      </div>
      <UTable
        class="max-lg:overflow-x-scroll mt-4"
        :rows="filteredProposals"
        :columns="proposalsTableHeader"
      >
        <template #epoch-data="{ row }"> #{{ row.epoch }} </template>
        <template #votingType-data="{ row }">
          <MIconPower
            v-if="['Standard', 'Emergency'].includes(row.votingType)"
          />
          <MIconZero v-else-if="['Zero'].includes(row.votingType)" />
        </template>
        <template #proposal-data="{ row }">
          <div class="lg:flex gap-4">
            <NuxtLink
              class="underline cursor-pointer text-left text-wrap"
              @click="() => onViewProposal(row)"
            >
              {{ useParsedDescriptionTitle(row?.description).title }}
            </NuxtLink>
          </div>
          <p class="text-xs text-grey-500 mt-1">
            {{ row?.proposalLabel }} · Created:
            {{ useDate(row?.timestamp).toFormat("DD.MM.YY") }}
          </p>
        </template>
        <template #type-data="{ row }">
          <div class="flex">
            <ProposalTypeBadge :type="row.votingType" :proposal-word="false" />
          </div>
        </template>
        <template #state-data="{ row }">
          <ProposalStatus :version="row.state" />
        </template>
      </UTable>
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
  { key: "epoch", label: "Epoch" },
  { key: "votingType", label: "Token" },
  { key: "proposal", label: "Proposal" },
  { key: "type", label: "Type" },
  { key: "state", label: "Status" },
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
  titleTemplate: "%s - History",
});

async function onViewProposal(proposal: MProposal) {
  await navigateTo(`/proposal/${proposal.proposalId}`);
}
</script>
