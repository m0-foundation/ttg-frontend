<template>
  <NuxtLayout class="px-6 lg:p-0" name="config">
    <section class="flex flex-col gap-4">
      <ConfigParametersCard
        v-for="param in mutableParametersWithData"
        :key="param.key"
        :param="param"
      />

      <MSimpleTable
        :items="inmutableTableData"
        :fields="governanceTablesHeaders"
      >
        <template #header-left>
          <h3 class="text-grey-500 font-inter mt-4 mb-2">
            Immutable parameters
          </h3>
        </template>
        <template #cell(value)="{ value }">
          <MAddressAvatar
            :address="value"
            :short-address="false"
            :show-copy="true"
            :show-avatar="false"
          />
        </template>
      </MSimpleTable>
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import pick from "lodash/pick";

const spog = useSpogStore();
const { getValues, contracts } = storeToRefs(spog);
const proposalsStore = useProposalsStore();

const parametersData = [
  {
    title: "Emergency Proposal Threshold Ratio",
    key: "emergencyProposalThresholdRatio",
    description:
      "The number of yes votes as a percentage of the total POWER supply required to pass proposals which require a POWER Threshold.",
    docs: "https://docs.m0.org/portal/overview/whitepaper/iii.-governance/iii.iii-governance-controlled-ttg-parameters#power-threshold",
    type: "basisPoints",
  },
  {
    title: "Zero Proposal Threshold Ratio",
    key: "zeroProposalThresholdRatio",
    description:
      "The number of yes votes as a percentage of the total ZERO supply required to pass proposals which require a ZERO Threshold.",
    docs: "https://docs.m0.org/portal/overview/whitepaper/iii.-governance/iii.iii-governance-controlled-ttg-parameters#zero-threshold",
    type: "basisPoints",
  },
  {
    title: "Proposal Fee",
    key: "proposalFee",
    description: "The amount paid in CASH to submit any proposal.",
    docs: "https://docs.m0.org/portal/overview/whitepaper/iii.-governance/iii.iii-governance-controlled-ttg-parameters#proposal-fee",
    type: "decimals",
    copyValue: true,
  },
  {
    title: "Cash Token",
    key: "cashToken",
    description:
      "The internal currency of the TTG. It is used to pay Proposal Fee and to purchase POWER in the Dutch auction. It can be toggled between WETH and M.",
    docs: "https://docs.m0.org/portal/overview/whitepaper/iii.-governance/iii.iii-governance-controlled-ttg-parameters#cash",
    type: "cashToken",
    copyValue: true,
  },
];

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

const proposals = computed(() => proposalsStore.getProposals);

const mutableParametersWithData = computed(() =>
  mutable.value.map((p) => {
    return {
      key: p.key,
      value: p.value,
      ...parametersData.find((param) => param.key === p.key),
      proposal: proposals.value.find(
        (proposal) => proposal.proposalParams[0] === p.key
      ),
    };
  }),
);

const governanceTablesHeaders = [
  { key: "title", label: "Name", sortable: true },
  { key: "description", label: "Description" },
  { key: "value", label: "Value" },
];

const inmutableParametersData = [
  {
    title: "Standard Governor",
    key: "standardGovernor",
    description:
      "The address of the Standard Governor contract. It is the primary governance contract for the TTG.",
    type: "Governor",
  },
  {
    title: "Emergency Governor",
    key: "emergencyGovernor",
    description:
      "The address of the Emergency Governor contract. It is the secondary governance contract for the TTG.",
    type: "Governor",
  },
  {
    title: "POWER Token",
    key: "powerToken",
    description:
      "The address of the POWER token contract. It is the governance token of the TTG.",
    type: "Token",
  },
  {
    title: "ZERO Governor",
    key: "zeroGovernor",
    description:
      "The address of the ZERO Governor contract. It is the governance contract for the ZERO token.",
    type: "Governor",
  },
  {
    title: "ZERO Token",
    key: "zeroToken",
    description:
      "The address of the ZERO token contract. It is the governance token of the ZERO Governor.",
    type: "Token",
  },
  {
    title: "Distribution Vault",
    key: "vault",
    description:
      "The address of the Vault contract. It is the contract that holds protocol fees claimable by ZERO holders.",
    type: "Address",
  },
];

const inmutableTableData = computed(() => {
  return immutable.value
    .map((p) => ({
      key: p.key,
      value: p.value,
      ...inmutableParametersData.find((param) => param.key === p.key),
    }))
    .sort((a, b) => {
      if (a.type === "Token" && b.type !== "Token") {
        return -1;
      } else if (a.type !== "Token" && b.type === "Token") {
        return 1;
      } else {
        return 0;
      }
    });
});
</script>

<style>
.gov-table-title {
  @apply text-sm lg:text-xl text-grey-500 my-2;
}
</style>
