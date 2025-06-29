<template>
  <UCard class="flex flex-col gap-4 shadow-none">
    <div class="flex gap-4 justify-between flex-wrap mb-2">
      <div class="lg:flex-1">
        <h2 class="text-2xl font-normal">{{ param?.title }}</h2>
        <UBadge
          :label="param?.key"
          color="gray"
          variant="soft"
          class="font-mono bg-gray-100" />
      </div>
      <div class="flex gap-4 max-lg:order-2 max-lg:w-full">
        <div class="lg:text-end">
          <p class="lg:text-2xl font-medium font-ppformula">
            {{ formattedValue(param) }}
          </p>
          <UBadge color="gray" variant="soft" class="font-mono bg-gray-100">
            <span>
              {{
                param?.value ? shortenText(param.value) : 'Parameter not set'
              }}
              {{ param?.unit }}
            </span>
            <template #trailing>
              <template v-if="param?.copyValue && param?.value">
                <UButton
                  :icon="
                    isJustCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'
                  "
                  color="gray"
                  variant="ghost"
                  size="xs"
                  @click="copy(param.value)" />
              </template>
            </template>
          </UBadge>
        </div>
        <div v-if="param?.proposal?.executedEvent" class="max-lg:order-1">
          <UPopover>
            <UButton
              color="white"
              variant="link"
              icon="i-heroicons-ellipsis-horizontal" />

            <template #panel>
              <div class="text-xs">
                <div class="p-2">
                  <p>Last updated</p>
                  <p>
                    {{
                      useDate(
                        param?.proposal?.executedEvent?.timestamp,
                      ).toFormat('LLL')
                    }}
                  </p>
                </div>
                <UDivider />
                <UVerticalNavigation
                  :links="[
                    {
                      label: 'Show proposal',
                      to: `/proposal/${param?.proposal?.proposalId}`,
                    },
                  ]" />
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
    <div
      v-if="param?.docs || param?.description"
      class="font-inter text-grey-900 lg:w-3/4">
      <p>
        {{ param?.description }}
      </p>
      <div class="flex gap-3 items-center mt-2">
        <a
          v-if="param?.docs"
          :href="param?.docs"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs underline text-grey-600">
          Learn more
        </a>
        <div v-else />
      </div>
    </div>
  </UCard>
</template>
<script setup>
  import { formatUnits } from 'viem'
  import { shortenText } from '@/utils/misc'

  const { currentCashToken } = storeToRefs(useTtgStore())
  const { isJustCopied, copy } = useCopyClipboard()

  defineProps({
    param: {
      type: Object,
      default: () => {},
    },
  })

  const formattedValue = (param) => {
    if (!param) return
    if (param.key === 'cashToken') {
      return currentCashToken?.value?.symbol
    } else if (param.type === 'decimals') {
      return formatUnits(BigInt(param.value), 18)
    } else if (param.type === 'basisPoints') {
      return `${basisPointsToPercentage(param.value)}%`
    } else if (param.type === 'time') {
      return `${param.value >= 7200 ? param.value / 3600 + ' hours' : param.value / 60 + ' minutes'}`
    } else if (param.type === 'number') {
      return param.value
    }
    return
  }
</script>
