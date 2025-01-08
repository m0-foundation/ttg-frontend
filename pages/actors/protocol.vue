<template>
  <section>
    <USelectMenu
      v-model="selectedList"
      class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2 font-inter"
      :options="listsOptions"
      placeholder="All roles"
      multiple
    />
    <UTable :rows="filteredLists" :columns="listTableHeaders">
      <template #account-data="{ row }">
        <MAddressCopy :short-address="false" show-copy :address="row.account" />
      </template>
      <template #timestamp-data="{ row }">
        <span class="text-grey-600">{{
          useDate(row.timestamp).toFormat("DD.MM.YYYY")
        }}</span>
      </template>
    </UTable>
  </section>
</template>

<script setup lang="ts">
import uniqBy from "lodash/uniqBy";

const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Actors - Protocol",
});

const lists = computed(() => listsStore.getFlattenLists());

const listTableHeaders = [
  {
    key: "account",
    label: "Name or Address",
  },
  { key: "list", label: "Role" },
  { key: "timestamp", label: "Updated", sortable: true },
];

const listsOptions = computed(() => [
  ...new Set(lists.value.map((obj) => obj.list)),
]);

const selectedList = ref([]);

const filteredLists = computed(() => {
  const listsWithoutDuplicates = uniqBy(
    lists.value,
    (item) => item.account + item.list,
  );

  if (selectedList.value.length === 0) return listsWithoutDuplicates;

  return listsWithoutDuplicates.filter((obj) =>
    selectedList.value.includes(obj.list),
  );
});
</script>
