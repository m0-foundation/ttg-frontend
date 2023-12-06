<template>
  <div>
    <PageTitle>Lists</PageTitle>

    <LayoutPage>
      <div v-if="isLoading">Loading...</div>

      <div v-else>
        <div v-if="!lists || !lists.length">No Lists to show.</div>
        <MTable v-else :config="tableConfig" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { html } from "gridjs";

const apiStore = useApiClientStore();

useHead({
  titleTemplate: "%s - Lists",
});

const fetchLists = async () => {
  try {
    const data = await apiStore.client.registrar!.list.getLists();
    const listsStore = useListsStore();
    listsStore.setLists(data);
  } catch (error) {
    console.error({ error });
  }
};

const { isLoading } = useAsyncState(fetchLists(), null);

const store = useListsStore();
const { getFlattenLists: lists } = storeToRefs(store);

const tableConfig = computed(() => {
  return {
    columns: [
      {
        id: "list",
        name: "List",
        sort: true,
      },

      {
        id: "account",
        name: "Name or Address",
        sort: true,
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
    data: lists.value.map((p) => ({
      account: p.account,
      list: p.list,
      timestamp: p.timestamp,
    })),
    search: true,
  };
});
</script>
