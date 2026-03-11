<template>
  <section class="flex flex-col gap-2">
    <ConfigParametersCard
      v-for="param in mutableParametersWithData"
      :key="param.key"
      :param="param" />

    <CommonCard>
      <UTable :rows="inmutableTableData" :columns="governanceTablesHeaders">
        <template #value-data="{ row }">
          <MAddressCopy
            :data-test="`${row.key}-value`"
            :address="row.value"
            :short-address="false"
            :show-copy="true" />
        </template>
      </UTable>
    </CommonCard>
  </section>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import pick from 'lodash/pick'

  const ttg = useTtgStore()
  const { getValues, contracts } = storeToRefs(ttg)
  const proposalsStore = useProposalsStore()
  const { getTtgAddress: registrarAddress, getMToken } = useNetworkStore()

  const parametersData = [
    {
      title: 'Priority Proposal Threshold Ratio',
      key: 'emergencyProposalThresholdRatio',
      description:
        'The percentage of yes votes from the total POWER supply required to pass proposals which require a POWER Threshold.',
      docs: 'https://docs.m0.org/home/fundamentals/whitepaper/governance#power-threshold',
      type: 'basisPoints',
      unit: 'BPS',
    },
    {
      title: 'ZERO Proposal Threshold Ratio',
      key: 'zeroProposalThresholdRatio',
      description:
        'The percentage of yes votes from the total ZERO supply required to pass proposals that require a ZERO Threshold.',
      docs: 'https://docs.m0.org/home/fundamentals/whitepaper/governance#zero-threshold',
      type: 'basisPoints',
      unit: 'BPS',
    },
    {
      title: 'Proposal Fee',
      key: 'proposalFee',
      description: 'The amount paid in CASH to submit any proposal.',
      type: 'decimals',
      copyValue: true,
      unit: 'WEI',
    },
    {
      title: 'Cash Token',
      key: 'cashToken',
      description:
        'The internal currency of the TTG. Used to pay the Proposal Fee and to purchase POWER in the Dutch auction. It can be toggled between WETH and $M.',
      type: 'cashToken',
      copyValue: true,
    },
  ]

  const mapToArray = (obj: object) =>
    Object.keys(obj).map((key) => ({
      key,
      value: String(obj[key]),
    }))

  const immutable = computed(() => {
    return [
      ...mapToArray(
        pick(contracts.value, [
          'standardGovernor',
          'emergencyGovernor',
          'powerToken',
          'zeroGovernor',
          'zeroToken',
          'vault',
        ]),
      ),
      {
        key: 'registrar',
        value: registrarAddress().value,
      },
      {
        key: 'mToken',
        value: getMToken().value,
      },
      {
        key: 'wMContract',
        value: useNetworkStore().getNetwork().value.contracts.wrappedMToken,
      },
    ]
  })

  const mutable = computed(() => {
    return [
      ...mapToArray(
        pick(getValues.value, [
          'emergencyProposalThresholdRatio',
          'zeroProposalThresholdRatio',
          'proposalFee',
        ]),
      ),
      ...mapToArray(pick(contracts.value, ['cashToken'])),
    ]
  })

  const proposals = computed(() => proposalsStore.getProposals)

  const mutableParametersWithData = computed(() =>
    mutable.value.map((p) => {
      return {
        key: p.key,
        value: p.value,
        ...parametersData.find((param) => param.key === p.key),
        proposal: proposals.value.find(
          (proposal) => proposal.proposalParams[0] === p.key,
        ),
      }
    }),
  )

  const governanceTablesHeaders = [
    { key: 'title', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'value', label: 'Value' },
  ]

  const inmutableParametersData = [
    {
      title: 'Registrar',
      key: 'registrar',
      description:
        'A book of record of TTG-specific contracts and arbitrary key-value pairs and lists.',
    },
    {
      title: 'Standard Governor',
      key: 'standardGovernor',
      description:
        'The address of the Standard Governor contract. It is the primary governance contract for the TTG.',
      type: 'Governor',
    },
    {
      title: 'Emergency Governor',
      key: 'emergencyGovernor',
      description:
        'The address of the Emergency Governor contract. It is the secondary governance contract for the TTG.',
      type: 'Governor',
    },
    {
      title: 'POWER Token',
      key: 'powerToken',
      description:
        'The governance token of the Standard and Emergency Governor.',
      type: 'Token',
    },
    {
      title: 'ZERO Governor',
      key: 'zeroGovernor',
      description:
        'The address of the ZERO Governor contract. It is the governance contract for the ZERO token.',
      type: 'Governor',
    },
    {
      title: 'ZERO Token',
      key: 'zeroToken',
      description: 'The governance token of the Zero Governor.',
      type: 'Token',
    },
    {
      title: '$M Token',
      key: 'mToken',
      description:
        '$M is a fungible token that can be generated by a Minter by locking Eligible Collateral in a secure off-chain facility.',
    },
    {
      title: '$M (wrapped)',
      key: 'wMContract',
      description:
        'Our next-gen wrapper contract for the $M cryptodollar. This wrapper maintains a 1:1 rate with $M and offers integrators unprecedented control over yield in DeFi protocols.',
    },
    {
      title: 'Distribution Vault',
      key: 'vault',
      description:
        'The contract holding any assets which have accumulated via TTG operations.',
      type: 'Address',
    },
  ]

  const inmutableTableData = computed(() => {
    return immutable.value
      .map((p) => ({
        key: p.key,
        value: p.value,
        ...inmutableParametersData.find((param) => param.key === p.key),
      }))
      .sort((a, b) => {
        if (a.type === 'Token' && b.type !== 'Token') {
          return -1
        } else if (a.type !== 'Token' && b.type === 'Token') {
          return 1
        } else {
          return 0
        }
      })
  })
</script>

<style>
  .gov-table-title {
    @apply text-sm lg:text-xl text-grey-500 my-2;
  }
</style>
