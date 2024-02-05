<template>
  <div>
    <PageTitle>Governance Config</PageTitle>

    <section class="flex flex-col gap-8 p-6 lg:p-0">
      <MSimpleTable
        :search="true"
        :items="mutableTableData"
        :fields="governanceTablesHeaders"
      >
        <template #header-left>
          <h2 class="gov-table-title">Changeable parameters</h2>
        </template>
      </MSimpleTable>

      <MSimpleTable
        :search="true"
        :items="inmutableTableData"
        :fields="governanceTablesHeaders"
      >
        <template #header-left>
          <h2 class="gov-table-title">Non-changeable parameters</h2>
        </template>
      </MSimpleTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import pick from "lodash/pick";

const spog = useSpogStore();
const { getValues, contracts } = storeToRefs(spog);

useHead({
  titleTemplate: "%s - Configurations",
});

const mapToArray = (obj: object) =>
  Object.keys(obj).map((key) => ({
    key,
    value: String(obj[key]),
  }));

const immutable = computed(() => {
  return [
    ...mapToArray(
      pick(contracts.value, [
        "standardGovernor",
        "emergencyGovernor",
        "powerToken",
        "zeroGovernor",
        "zeroToken",
        "vault",
      ])
    ),
  ];
});

const mutable = computed(() => {
  return [
    ...mapToArray(
      pick(getValues.value, [
        "emergencyProposalThresholdRatio",
        "zeroProposalThresholdRatio",
        "proposalFee",
      ])
    ),
    ...mapToArray(pick(contracts.value, ["cashToken"])),
  ];
});

const governanceTablesHeaders = ref([
  { key: "key", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
]);

const mutableTableData = computed(() => {
  return mutable.value.map((p) => ({
    key: p.key,
    value: p.value,
  }));
});

const inmutableTableData = computed(() => {
  return immutable.value.map((p) => ({
    key: p.key,
    value: p.value,
  }));
});
</script>

<style>
.gov-table-title {
  @apply text-sm lg:text-lg text-grey-600 my-2;
}
</style>
