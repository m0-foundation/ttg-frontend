<template>
  <div class="px-6 lg:p-0">
    <MSimpleTable
      :search="true"
      :items="protocolTableData"
      :fields="protocolTableHeaders"
      :loading="isLoading"
    >
      <template #header-left>
        <PageTitle>M^0 Protocol Configurations</PageTitle>
      </template>
    </MSimpleTable>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

useHead({
  titleTemplate: "%s - Protocol configurations",
});

const apiStore = useApiClientStore();
const protocolTableHeaders = ref([
  { key: "key", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
]);

const fetchProtocolConfigs = async () => {
  try {
    const data =
      await apiStore.client.registrar!.protocolConfigs.getAllProtocolKeysAndValues();
    const store = useProtocolConfigsStore();
    store.setProtocolConfigs(data);
    console.log("fetched configs", { data });
  } catch (error) {
    console.error({ error });
  }
};

const { isLoading } = useAsyncState(fetchProtocolConfigs(), null);

const store = useProtocolConfigsStore();
const { configs: data } = storeToRefs(store);

const protocolTableData = computed(() => {
  return data.value.map((p) => ({
    value: p.value,
    key: p.key,
  }));
});
</script>
