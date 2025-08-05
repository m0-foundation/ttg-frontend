<template>
  <div v-if="asList" class="flex flex-col gap-2">
    <UButton
      v-for="(item, index) in flatDropdownItems"
      :key="index"
      :icon="item.icon"
      variant="ghost"
      class="justify-start"
      size="xs"
      @click="handleClick(item)">
      {{ item.label }}
    </UButton>
  </div>

  <UDropdown v-else :items="dropdownItems" :ui="{ width: 'w-fit max-w-72' }">
    <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal">
      More
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
  import { MProposal } from '@/lib/api/types'
  import { copyToClipboard } from '@/utils/misc'

  const props = defineProps<{
    proposal: MProposal
    asList?: boolean
  }>()

  const url = useRequestURL()

  const dropdownItems = ref([
    [
      {
        label: 'Copy proposal URL',
        icon: 'i-heroicons-clipboard',
        click: () =>
          copyToClipboard(
            `${url.origin}/proposal/${props.proposal.proposalId}`,
          ),
      },
      {
        label: 'Copy proposal ID',
        icon: 'i-heroicons-clipboard',
        click: () => copyToClipboard(props.proposal.proposalId),
      },
      {
        label: 'Copy block number',
        icon: 'i-heroicons-clipboard',
        click: () => copyToClipboard(props.proposal.blockNumber),
      },
      {
        label: 'View on block explorer',
        icon: 'i-heroicons-globe-alt',
        to: useBlockExplorer('tx', props.proposal.transactionHash),
        target: '_blank',
      },
    ],
  ])

  // Flatten dropdown items for list rendering
  const flatDropdownItems = computed(() => dropdownItems.value.flat())

  function handleClick(item: any) {
    if (item.click) {
      item.click()
    } else if (item.to) {
      window.open(item.to, item.target || '_self')
    }
  }
</script>
