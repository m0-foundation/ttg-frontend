<template>
  <div>
    <PageTitle>M^0 Protocol Configurations</PageTitle>

    <LayoutPage>
      <div v-if="isLoading">Loading...</div>

      <div v-else>
        <div v-if="!data || !data.length">No data to show.</div>
        <MTable v-else :config="tableConfig" />
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { html } from "gridjs";

const apiStore = useApiClientStore();

const fetchProtocolConfigs = async () => {
  try {
    const data =
      await apiStore.client.registrar!.protocolConfigs.getProtocolConfigs();
    const store = useProtocolConfigsStore();
    store.setProtocolConfigs(data);
    console.log("fetched configs", { data });
  } catch (error) {
    console.error({ error });
  }
};

const { isLoading } = useAsyncState(fetchProtocolConfigs(), null);

const store = useProtocolConfigsStore();
const { getConfigsAsArray: data } = storeToRefs(store);

const tableConfig = computed(() => {
  return {
    columns: [
      {
        id: "key",
        name: "Name",
        sort: true,
      },

      {
        id: "value",
        name: "Value",
        sort: true,
      },

      {
        id: "timestamp",
        name: "Updated",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-primary">${formatedDate}</span>`
          );
        },
      },
    ],
    data: data.value.map((p) => ({
      value: p.value,
      key: p.key,
      timestamp: p.timestamp,
    })),
    search: true,
  };
});
</script>
