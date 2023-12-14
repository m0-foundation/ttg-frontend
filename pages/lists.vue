<template>
  <div>
    <PageTitle class="lg:p-0 lg:mb-6">
      <template #default>Lists</template>
      <template #side>
        <div class="flex gap-3 mt-2 lg:mt-0">
          <select
            v-model="selectedList"
            class="h-[32px] w-[170px] bg-transparent text-grey-100 text-xxs p-0 px-2"
          >
            <option value="all" default>All lists</option>
            <option
              v-for="option in listsOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <MInput
            v-model="inputSearch"
            class="h-[32px] w-[170px] text-xxs border-grey-600 text-grey-400 placeholder:text-grey-400 bg-transparent font-inter"
            placeholder="ENS or address"
            type="text"
          />
        </div>
      </template>
    </PageTitle>

    <div class="px-6">
      <div v-if="isLoading">
        <span class="text-xs text-grey-400">Loading...</span>
      </div>

      <div v-else>
        <div v-if="!lists || !lists.length">No Lists to show.</div>
        <MTable
          v-else
          :key="filteredLists"
          class="bg-transparent"
          :config="tableConfig"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { html } from "gridjs";

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

const listsOptions = computed(() => [
  ...new Set(lists.value.map((obj) => obj.list)),
]);

const selectedList = ref("all");
const inputSearch = ref("");

const filteredLists = computed(() => {
  const searchResults = lists.value.filter((list) =>
    list.account.toLowerCase().includes(inputSearch.value.toLowerCase())
  );

  if (selectedList.value === "all") return searchResults;
  return searchResults.filter((obj) => obj.list === selectedList.value);
});

const tableConfig = computed(() => {
  return {
    columns: [
      {
        id: "account",
        name: "Name or Address",
        sort: true,
        formatter: (cell: string) => {
          return html(`<span class="text-xs text-grey-100">${cell}</span>`);
        },
      },

      {
        id: "list",
        name: "List",
        sort: true,
        formatter: (cell: string) => {
          return html(`<span class="text-xs text-grey-100">${cell}</span>`);
        },
      },

      {
        id: "timestamp",
        name: "Added",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-400">${formatedDate}</span>`
          );
        },
      },
    ],
    data: filteredLists.value.map((p) => ({
      account: p.account,
      list: p.list,
      timestamp: p.timestamp,
    })),
  };
});
</script>
