<template>
  <div class="px-6 lg:p-0">
    <MSimpleTable
      :search="true"
      :items="filteredLists"
      :fields="listTableHeaders"
      :loading="isLoading"
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
      <template #cell(account)="{ value }">
        <MAddressAvatar :short-address="false" show-copy :address="value" />
      </template>
      <template #cell(timestamp)="{ value }">
        <span class="text-grey-600">{{
          useDate(value).toFormat("DD.MM.YYYY")
        }}</span>
      </template>
    </MSimpleTable>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const apiStore = useApiClientStore();
const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Lists",
});

const fetchLists = async () => {
  try {
    const data = await apiStore.client.registrar!.list.getLists();
    listsStore.setLists(data);
    console.log("fetched Lists", { data });
  } catch (error) {
    console.error({ error });
  }
};

const { isLoading } = useAsyncState(fetchLists(), null);
const { getFlattenLists: lists } = storeToRefs(listsStore);

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
  if (selectedList.value === "all") return lists.value;
  return lists.value.filter((obj) => obj.list === selectedList.value);
});

onBeforeUnmount(() => {
  listsStore.setLists([]);
});
</script>
