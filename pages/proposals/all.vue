<template>
  <div>
    <PageTitle class="px-6 lg:px-0">
      <template #pretitle>
        <NuxtLink
          class="text-green-700 hover:text-green-600 text-sm uppercase cursor-pointer"
          @click="$router.back()"
          >Back</NuxtLink
        >
      </template>
      <template #default>All proposals</template>
    </PageTitle>

    <MSimpleTable
      class="px-6 lg:px-0"
      :items="filteredProposals"
      :fields="proposalsTableHeader"
    >
      <template #header-right>
        <div class="flex gap-3 mt-2 lg:mt-0">
          <select
            v-model="selectedType"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2"
          >
            <option value="all" default>All proposals</option>
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
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2"
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
        <NuxtLink :href="`/proposal/${item?.proposalId}/`" class="underline">{{
          useParsedDescriptionTitle(item?.description).title
        }}</NuxtLink>
        <p class="text-xs text-grey-400 mt-1">
          {{ item?.proposalLabel }} · Created:
          {{ useDate(item?.timestamp).toFormat("DD.MM.YY") }}
        </p>
      </template>
      <template #cell(state)="{ value }">
        <ProposalStatus :version="value" />
      </template>
    </MSimpleTable>
  </div>
</template>

<script setup lang="ts">
import ProposalStatus from "@/components/proposal/Status.vue";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

const selectedType = ref("all");
const selectedEpoch = ref(0);

const proposalsTableHeader = [
  { key: "epoch", label: "Epoch", sortable: true },
  { key: "votingType", label: "Token", sortable: false },
  { key: "proposal", label: "Proposal", sortable: true },
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
</script>
