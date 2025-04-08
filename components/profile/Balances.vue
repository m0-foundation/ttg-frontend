<template>
  <UCard class="bg-grey-200">
    <div class="flex justify-between w-full items-center">
      <h3 class="text-xl">{{ props.type }} Tokens</h3>
      <div>
        <ProfileTokenMenu
          v-if="props.type === 'POWER'"
          :token="getTokens?.power" />
        <ProfileTokenMenu v-else :token="getTokens?.zero" />
      </div>
    </div>

    <div class="flex justify-between mt-3">
      <span>My token balance</span>
      <div class="flex items-center gap-2">
        <MIconPower class="w-4 h-4" />
        <span>
          {{
            useNumberFormatterPrice(
              props.type === 'POWER'
                ? balancePowerToken?.data.value?.formatted || 0n
                : balanceZeroToken?.data.value?.formatted || 0n,
            )
          }}
        </span>
      </div>
    </div>

    <UDivider class="my-3" />

    <div>
      <span>Voting power</span>
      <div class="flex items-center gap-2 mt-2">
        <MIconPower class="w-5 h-5" />
        <span class="text-xl font-ppformula leading-none">
          {{
            useNumberFormatterPrice(
              props.type === 'POWER'
                ? powerVotingPower?.data.value?.formatted || 0n
                : zeroVotingPower?.data.value?.formatted || 0n,
            )
          }}
        </span>
      </div>
      <p class="text-xs text-grey-500 mt-2">
        {{
          props.type === 'POWER'
            ? powerVotingPower?.data.value?.relative?.toFixed(4)
            : zeroVotingPower?.data.value?.relative?.toFixed(4)
        }}%
        <span class="mx-1 text-xxs">out of total voting power</span>
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  import { Hash } from 'viem'
  import { storeToRefs } from 'pinia'
  import { useMBalances, useMVotingPower } from '@/lib/hooks'

  const props = defineProps<{
    address: Ref<Hash>
    type: 'POWER' | 'ZERO'
  }>()

  const address = toRef(props, 'address')

  const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
    useMBalances(address)

  const { power: powerVotingPower, zero: zeroVotingPower } =
    useMVotingPower(address)

  const ttg = useTtgStore()
  const { getTokens } = storeToRefs(ttg)
</script>
