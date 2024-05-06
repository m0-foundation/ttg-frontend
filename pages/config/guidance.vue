<template>
  <NuxtLayout class="px-6 lg:p-0" name="config">
    <section class="flex flex-col gap-4">
      <MIconLoading v-if="isLoading" />
      <ConfigParametersCard
        v-for="param in protocolDataSorted"
        v-else
        :key="param.key"
        :param="param"
        class="card--config"
      />
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

useHead({
  titleTemplate: "%s - Protocol guidances",
});

const apiStore = useApiClientStore();
const store = useProtocolConfigsStore();
const proposalsStore = useProposalsStore();
const { getProtocolGuidances } = storeToRefs(store);

const fetchProtocolConfigs = async () => {
  if (getProtocolGuidances.value.length) return;
  try {
    const response = await apiStore.client.registrar!.protocolConfigs.getAllProtocolKeysAndValues();
    store.setProtocolConfigs(response);
  } catch (error) {
    console.error({ error });
  }
};

const { isLoading } = useAsyncState(fetchProtocolConfigs(), null);

const proposals = computed(() => proposalsStore.getProposals);

const protocolParametersData = [
  {
    title: "Guidance",
    key: "guidance",
    description:
      "This document provides guidance for Minters and Validators as to the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.",
    docs: "https://docs.m0.org/portal/overview/whitepaper/v.-off-chain-ecosystem/v.i-guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "Ecosystem Guidance",
    key: "ecosystem_guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "Collateral Guidance",
    key: "collateral_guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "SPV Operator Guidance",
    key: "spv_operators_guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "Validator Guidance",
    key: "validators_guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "Minter Guidance",
    key: "minters_guidance",
    type: "guidance",
    copyValue: true,
  },
  {
    title: "Manadatory Contract Clauses Guidance",
    key: "mandatory_contract_guidance",
    type: "guidance",
    copyValue: true,
  },
];

const protocolDataSorted = computed(() => {
  // Add custom and proposal data to parameters and sort it to show custom parameters first
  return getProtocolGuidances.value.map((p) => ({
    value: p.value,
    key: p.key,
    ...protocolParametersData.find((param) => param.key === p.key),
    proposal: proposals.value.find(
      (proposal) =>
        proposal.proposalParams[0] === p.key &&
        proposal.executedEvent?.timestamp
    ),
  }));
});
</script>
