<template>
  <div data-test="technical-proposal" class="mt-4 p-4 bg-slate-100 border">
    <h2 class="text-2xl">Technical Proposal</h2>
    <p class="text-sm text-grey-500 mb-4">
      Agree or deny the following incoming change
    </p>

    <div v-if="current && isActiveProposal">
      <div
        class="uppercase font-mono bg-[#353835] leading-3 text-[#AEAFAE] text-xs py-2 p-3">
        Current
      </div>
      <div
        id="technical-proposal-current"
        class="bg-[#0B0B0B] text-grey-100 text-sm py-2 p-3">
        <span class="block">{{ current.key }}</span>
        <span class="block">{{ current.value }}</span>
      </div>
    </div>
    <div
      class="font-mono leading-3 bg-[#00CC9B] text-[#0B0B0B] text-xs py-2 p-3 flex justify-between">
      <p class="uppercase">Incoming Change</p>

      <p>
        {{ props.proposal?.proposalLabel }}
      </p>
    </div>
    <div
      id="technical-proposal-incoming-change"
      class="bg-[#003327] text-[#00CC9B] text-sm py-2 p-3">
      <div v-if="showParsed">
        <div v-for="(param, index) in incomingValuesParsed" :key="param">
          <span v-if="param.includes('0x')">{{ param }}</span>
          <span v-else>{{ param }} ({{ incomingValues[index] }})</span>
        </div>
      </div>

      <div v-else>
        <div v-if="incomingValues">
          <span class="break-words">
            <span class="block">{{ incomingValues[0] }}</span>
            <span class="block">{{ incomingValues[1] }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MProposal } from '@/lib/api/types'

  export interface ProposalProps {
    proposal: MProposal
    currentProposalValues: {
      setProposalFee: string
      setEmergencyProposalThresholdRatio: string
      setZeroProposalThresholdRatio: string
      setCashToken: string
    }
  }
  const props = defineProps<ProposalProps>()

  const apiStore = useApiClientStore()

  const { data: protocolKeysAndValues } = await useAsyncData(
    'protocolKeysAndValues',
    () =>
      apiStore.client.registrar!.protocolConfigs.getAllProtocolKeysAndValues(),
  )

  const parsedIncomingValue = (value: string, type: string) => {
    const formatFee = (value: string) => useFormatCash(value)

    if (['setProposalFee', 'setStandardProposalFee'].includes(type)) {
      return formatFee(value)
    }

    if (
      [
        'setEmergencyProposalThresholdRatio',
        'setZeroProposalThresholdRatio',
      ].includes(type)
    ) {
      return `${basisPointsToPercentage(value)}%`
    }

    if (['setCashToken'].includes(type)) {
      if (typeof value === 'bigint') return formatFee(value)
      if (typeof value === 'string')
        return value.includes('0x') ? value : formatFee(value)
    }

    return value
  }

  const isActiveProposal = computed(() => props.proposal.state === 'Active')

  const showParsed = computed(() =>
    [
      'setProposalFee',
      'setStandardProposalFee',
      'setEmergencyProposalThresholdRatio',
      'setZeroProposalThresholdRatio',
      'setCashToken',
    ].includes(props.proposal?.proposalType),
  )

  const current = computed(() => {
    if (!protocolKeysAndValues.value || !incomingValues.value?.[0]) return null
    return protocolKeysAndValues.value.find((item: { key: string }) =>
      incomingValues.value?.[0].includes(item.key),
    )
  })

  const incomingValues = computed(() => props.proposal?.proposalParams)

  const incomingValuesParsed = computed(() =>
    props.proposal?.proposalParams.map((param) =>
      parsedIncomingValue(param, props.proposal?.proposalType),
    ),
  )
</script>
