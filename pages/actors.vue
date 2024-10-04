<template>
  <div class="px-6 lg:p-0">
    <MSimpleTable
      :search="true"
      :items="filteredLists"
      :fields="listTableHeaders"
    >
      <template #header-left>
        <PageTitle>Actors</PageTitle>
      </template>
      <template #header-right>
        <select
          v-model="selectedList"
          class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2 font-inter"
        >
          <option value="all" default>All roles</option>
          <option v-for="option in listsOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </template>

      <template #cell(list)="{ value }">
        {{ value.replace("rs", "r") }}
      </template>

      <template #cell(account)="{ value }">
        <MAddressCopy :short-address="false" show-copy :address="value" />
      </template>
      <template #cell(timestamp)="{ value }">
        <span class="text-grey-600">{{
          useDate(value).toFormat("DD.MM.YYYY")
        }}</span>
      </template>
    </MSimpleTable>

    <MSimpleTable
      :search="true"
      :items="earnersClaimants"
      :fields="earnersClaimantsHeaders"
      :loading="isLoading"
    >
      <template #header-left>
        <PageTitle>Earners Claimants</PageTitle>
      </template>

      <template #cell(earner)="{ value }">
        <MAddressCopy :short-address="false" show-copy :address="value" />
      </template>

      <template #cell(claimant)="{ value }">
        <MAddressCopy :short-address="false" show-copy :address="value" />
      </template>
    </MSimpleTable>
  </div>
</template>

<script setup lang="ts">
import { Hash, trim } from "viem";
import uniqBy from "lodash/uniqBy";
import { generateKeyEarnerClaimant } from "@/lib/api/utils";

const apiStore = useApiClientStore();
const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Lists",
});

const lists = computed(() => listsStore.getFlattenLists());

const listTableHeaders = [
  {
    key: "account",
    label: "Name or Address",
    sortable: true,
  },
  { key: "list", label: "Role", sortable: true },
  { key: "timestamp", label: "Updated", sortable: true },
];

const listsOptions = computed(() => [
  ...new Set(lists.value.map((obj) => obj.list)),
]);

const selectedList = ref("all");

const filteredLists = computed(() => {
  const listsWithoutDuplicates = uniqBy(
    lists.value,
    (item) => item.account + item.list,
  );

  if (selectedList.value === "all") return listsWithoutDuplicates;
  return listsWithoutDuplicates.filter(
    (obj) => obj.list === selectedList.value,
  );
});

onBeforeUnmount(() => {
  listsStore.setLists([]);
});

const earnersClaimantsHeaders = [
  {
    key: "earner",
    label: "Earner",
    sortable: true,
  },
  { key: "claimant", label: "Claimant", sortable: true },
];

const fetchEarnerClaimants = async () => {
  try {
    if (!listsStore.earners) return undefined;

    const keys = listsStore.earners?.map((earner) =>
      generateKeyEarnerClaimant(earner.account as Hash),
    );

    const claimants =
      await apiStore.client.registrar!.protocolConfigs.getValuesByRawKeys(keys);

    return listsStore.earners
      .map((earner) => {
        const key = generateKeyEarnerClaimant(earner.account as Hash);
        const claimant = claimants.find((c: any) => c.key === key)?.value;
        if (claimant) {
          return {
            earner: earner.account as Hash,
            claimant: trim(claimant as Hash),
            key,
          };
        }
      })
      .filter((item) => item);
  } catch (error) {
    console.error({ error });
    return error;
  }
};

const { isLoading, state: earnersClaimants } = useAsyncState(
  fetchEarnerClaimants(),
  null,
);

console.log({ earnersClaimants });
</script>
