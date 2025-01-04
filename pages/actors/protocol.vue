<template>
  <MSimpleTable
    :search="true"
    :items="filteredLists"
    :fields="listTableHeaders"
  >
    <template #header-left>
      <PageTitle>Protocol actors</PageTitle>
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
</template>

<script setup lang="ts">
import uniqBy from "lodash/uniqBy";

const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Actors | Protocol",
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
</script>
