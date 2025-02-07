<template>
  <div>
    <UPopover>
      <UButton
        color="black"
        trailing-icon="i-heroicons-chevron-down-20-solid"
        :ui="{
          icon: { size: { md: 'w-4 h-4' } },
          color: { black: { solid: 'text-white bg-transparent' } },
        }"
      >
        <MAddressAvatar
          :address="address"
          :link="false"
          class="tracking-normal hidden lg:block"
        />
        <Jazzicon :address="address" class="w-5 h-5 lg:hidden" :diameter="16" />
      </UButton>

      <template #panel="{ close }">
        <div class="p-6 w-72">
          <p class="uppercase text-xxs text-grey-500 mb-2 font-semibold">
            My voting power
          </p>
          <div class="flex flex-col gap-3">
            <div v-for="token in tokens" :key="token.label">
              <span class="text-sm">
                <span class="uppercase">{{ token.label }}</span> Tokens
              </span>
              <div class="flex justify-between items-end gap-2">
                <div class="flex items-center gap-2">
                  <component :is="token.icon" class="w-5 h-5" />
                  <span class="text-xl leading-tight">
                    {{ token.votingPower }}%
                  </span>
                </div>
                <span class="text-sm text-grey-500 mb-0.5">{{
                  useNumberFormatterPrice(String(token.balance), 0, 2)
                }}</span>
              </div>
            </div>
            <UButton
              to="/profile/me"
              label="My profile"
              color="gray"
              block
              @click="close()"
            />
            <UButton
              label="Disconnect"
              color="black"
              variant="link"
              size="sm"
              class="underline"
              :padded="false"
              @click="[disconnect(), close()]"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower, useMBalances } from "@/lib/hooks";
import { Jazzicon } from "vue3-jazzicon/src/components";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const { disconnect } = useDisconnect();
const { address } = useAccount();

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const tokens = computed(() => {
  return [
    {
      label: "Power",
      balance: balancePowerToken?.data.value?.formatted || 0n,
      votingPower: powerVotingPower?.data.value?.relative || 0n,
      icon: MIconPower,
    },
    {
      label: "Zero",
      balance: balanceZeroToken?.data.value?.formatted || 0n,
      votingPower: zeroVotingPower?.data.value?.relative || 0n,
      icon: MIconZero,
    },
  ];
});
</script>
