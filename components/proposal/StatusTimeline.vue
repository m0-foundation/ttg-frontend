<template>
  <div>
    <div class="text-gray-900 text-base mb-4">Status:</div>

    <div class="flex flex-col text-grey-600 gap-1 lg:gap-1 items-center">
      <div class="relative ms-4">
        <div
          class="absolute left-[3.5px] top-[10px] h-[140px] w-[1px] bg-gray-200"></div>

        <ProposalStatusBadge :version="version" name="Pending" />

        <ProposalStatusBadge :version="version" name="Active" />

        <ProposalStatusBadge
          v-if="version === 'Defeated'"
          :version="version"
          name="Defeated" />

        <ProposalStatusBadge v-else :version="version" name="Succeeded" />

        <ProposalStatusBadge
          v-if="version === 'Expired'"
          :version="version"
          name="Expired" />

        <UDropdown v-else-if="version === 'Executed'" :items="dropdownItems">
          <ProposalStatusBadge
            :version="version"
            name="Executed"
            :show-arrow="true"
            data-test="executed-badge"
            class="cursor-pointer" />
        </UDropdown>

        <ProposalStatusBadge v-else :version="version" name="Executed" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MProposal } from '@/lib/api/types'

  export interface Props {
    version: string
    proposal: MProposal | undefined
  }

  const props = defineProps<Props>()
  const { toFormat } = useDate(
    Number(props?.proposal?.executedEvent?.timestamp),
  )

  const dropdownItems = ref([
    [
      {
        label: `Executed on ${toFormat('lll')}`,
        disabled: true,
        labelClass: 'cursor-auto text-grey-600',
      },
      {
        label: 'Copy block number',
        icon: 'i-heroicons-cube-transparent',
        click: () => copyToClipboard(props.proposal?.blockNumber),
      },
      {
        label: 'View on block explorer',
        icon: 'i-heroicons-cube',
        to: useBlockExplorer('tx', props.proposal?.transactionHash || ''),
        target: '_blank',
      },
    ],
  ])
</script>
