<template>
  <section class="flex flex-col gap-4">
    <MIconLoading v-if="isLoading" />
    <ConfigParametersCard
      v-for="param in protocolDataSorted"
      v-else
      :key="param.key"
      :param="param"
      class="card--config" />
  </section>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  useHead({
    titleTemplate: '%s - Protocol guidances',
  })

  const apiStore = useApiClientStore()
  const store = useProtocolConfigsStore()
  const proposalsStore = useProposalsStore()
  const { getProtocolGuidances } = storeToRefs(store)

  const fetchProtocolConfigs = async () => {
    if (getProtocolGuidances.value.length) return
    try {
      const response =
        await apiStore.client.registrar!.protocolConfigs.getAllProtocolKeysAndValues()
      store.setProtocolConfigs(response)
    } catch (error) {
      console.error({ error })
    }
  }

  const { isLoading } = useAsyncState(fetchProtocolConfigs(), null)

  const proposals = computed(() => proposalsStore.getProposals)

  const protocolParametersData = [
    {
      title: 'Adopted Guidance',
      key: 'guidance',
      description:
        'This document provides general Adopted guidance for the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'Ecosystem Guidance',
      key: 'ecosystem_guidance',
      description:
        'This document provides guidance for the Ecosystem of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'Collateral Guidance',
      key: 'collateral_guidance',
      description:
        'This document provides guidance for the Collaterals of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'SPV Operators Guidance',
      key: 'spv_operators_guidance',
      description:
        'This document provides guidance for the SPV Operators of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'Validators Guidance',
      key: 'validators_guidance',
      description:
        'This document provides guidance for the Validators of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'Minters Guidance',
      key: 'minters_guidance',
      description:
        'This document provides guidance for the Minters of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
    {
      title: 'Mandatory Contract Clauses Guidance',
      key: 'mandatory_contract_guidance',
      description:
        'This document provides guidance for the Mandatory Contracts of the off-chain procedures they are expected to follow. It is displayed in the TTG as a hash to ensure readers can remain confident in the provenance of the version they are consuming.',
      docs: 'https://docs.m0.org/home/getting-started/whitepaper/offchain-ecosystem/#vi-guidance',
      type: 'guidance',
      copyValue: true,
    },
  ]

  const protocolDataSorted = computed(() => {
    // Add custom and proposal data to parameters and sort it to show custom parameters first
    return getProtocolGuidances.value.map((p) => ({
      value: p.value,
      key: p.key,
      ...protocolParametersData.find((param) => param.key === p.key),
      proposal: proposals.value.find(
        (proposal) =>
          proposal.proposalParams[0] === p.key &&
          proposal.executedEvent?.timestamp,
      ),
    }))
  })
</script>
