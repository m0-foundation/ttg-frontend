<template>
  <div>
    <PageTitle>mutable governance configurations</PageTitle>
    <LayoutPage>
      <div v-if="!mutable || !mutable.length">
        No mutable config data to show.
      </div>
      <MTable v-else :config="mutableTable" />
    </LayoutPage>

    <PageTitle>immutable governance configurations</PageTitle>
    <LayoutPage>
      <div v-if="!immutable || !immutable.length">
        No immutable config data to show.
      </div>
      <MTable v-else :config="immutableTable" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import pick from "lodash/pick";

const spog = useSpogStore();
const { values, contracts } = storeToRefs(spog);

const mapToArray = (obj: object) =>
  Object.keys(obj).map((key) => ({
    key,
    value: String(obj[key]),
  }));

const immutable = computed(() => {
  return [
    ...mapToArray(pick(values.value, ["clock", "votingDelay", "votingPeriod"])),
    ...mapToArray(
      pick(contracts.value, [
        "cashToken",
        "zeroToken",
        "powerToken",
        "registrar",
      ])
    ),
  ];
});

const mutable = computed(() => {
  return [
    ...mapToArray(
      pick(values.value, [
        "powerTokenQuorumRatio",
        "zeroTokenQuorumRatio",
        "proposalFee",
        "minProposalFee",
        "maxProposalFee",
      ])
    ),
    ...mapToArray(
      pick(contracts.value, [
        "cashToken",
        "zeroToken",
        "powerToken",
        "registrar",
      ])
    ),
  ];
});

const mutableTable = computed(() => {
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
    data: mutable.value.map((p) => ({
      key: p.key,
      value: p.value,
    })),
    search: true,
  };
});

const immutableTable = computed(() => {
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
    data: immutable.value.map((p) => ({
      key: p.key,
      value: p.value,
    })),
    search: true,
  };
});
</script>
