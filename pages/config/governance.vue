<template>
  <div>
    <nav class="text-white text-xl p-8">
      <MNavButton>
        Governance Configurations
        <span class="text-primary">_</span>
      </MNavButton>
    </nav>

    <LayoutPage>
      <div v-if="!data || !data.length">No Configs to show.</div>
      <MTable v-else :config="tableConfig" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const spog = useSpogStore();
const { values, contracts } = storeToRefs(spog);

const data = computed(() => {
  const mapToArray = (ref: Ref) =>
    Object.keys(ref.value).map((key) => ({
      key,
      value: String(ref.value[key]),
    }));

  return [...mapToArray(values), ...mapToArray(contracts)];
});

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
    ],
    data: data.value.map((p) => ({
      key: p.key,
      value: p.value,
    })),
    search: true,
  };
});
</script>
