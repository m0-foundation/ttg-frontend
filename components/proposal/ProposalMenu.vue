<template>
  <div v-if="asList" class="flex flex-col gap-2">
    <UButton
      v-for="(item, index) in flatDropdownItems"
      :key="index"
      :icon="copiedIndex === index ? 'i-heroicons-check' : item.icon"
      variant="ghost"
      class="justify-start font-normal text-grey-600"
      size="xs"
      @click="handleClick(item, index)">
      {{ copiedIndex === index ? 'Copied' : item.label }}
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
        icon: 'i-heroicons-globe-alt',
        click: () =>
          copyToClipboard(
            `${url.origin}/proposal/${props.proposal.proposalId}`,
          ),
      },
      {
        label: 'Copy proposal ID',
        icon: 'i-heroicons-document-text',
        click: () => copyToClipboard(props.proposal.proposalId),
      },
      {
        label: 'Copy block number',
        icon: 'i-heroicons-cube-transparent',
        click: () => copyToClipboard(props.proposal.blockNumber),
      },
      {
        label: 'View on block explorer',
        icon: 'i-heroicons-cube',
        to: useBlockExplorer('tx', props.proposal?.transactionHash || ''),
        target: '_blank',
      },
    ],
  ])

  // Flatten dropdown items for list rendering
  const flatDropdownItems = computed(() => dropdownItems.value.flat())

  const copiedIndex = ref<number | null>(null)

  function handleClick(item: any, index: number) {
    if (item.click) {
      item.click()

      // Show "Copied" temporarily if it’s a copy action
      if (item.label.startsWith('Copy')) {
        copiedIndex.value = index
        setTimeout(() => {
          copiedIndex.value = null
        }, 2000)
      }
    } else if (item.to) {
      window.open(item.to, item.target || '_self')
    }
  }
</script>
