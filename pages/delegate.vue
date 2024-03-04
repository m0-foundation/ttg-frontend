<template>
  <div>
    <div class="px-6 lg:p-0">
      <PageTitle class="mb-3">Delegate voting power</PageTitle>

      <p class="text-grey-600 text-sm lg:text-base mb-6">
        You can delegate your voting power to any address. The tokens will
        remain in your balance, and you can re-delegate them in the future.
      </p>
    </div>

    <div v-show="!canDelegate" class="bg-accent-blue p-6 mb-6">
      <span class="uppercase mb-2 text-xs">Warning</span>

      <div class="flex items-center gap-3">
        <MIconWarning class="w-12" />
        <p>
          The transfer epoch has concluded. You will be able to delegate in the
          next
          <b>Transfer</b> epoch.
        </p>
      </div>
    </div>

    <form
      class="my-4 bg-grey-800 p-6 font-inter"
      @submit.prevent="delegatePower"
    >
      <div>
        <div class="flex justify-between items-center mb-3">
          <div>$POWER tokens</div>
          <div class="flex gap-1 items-center">
            <MIconPower class="h-6 w-6" />
            <span
              class="flex items-center text-2xl"
              :class="{
                'text-accent-mint': !canDelegate,
              }"
            >
              {{ balancePowerToken?.data.value?.formatted }}
            </span>
          </div>
        </div>
        <label class="text-grey-600">Delegation address</label>
        <input
          id="input-delegate-power"
          v-model="inputPowerDelegates"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-4"
          data-test="delegate-power-input-address"
        />

        <div v-if="hasDelegatedPower" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ powerDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressPower"
        >
          Use my address
        </NuxtLink>
        <MButton
          id="button-delegate-power"
          type="submit"
          :disabled="
            !isConnected ||
            !canDelegate ||
            !inputPowerDelegates ||
            isLoadingPower
          "
          data-test="delegate-button-power-submit"
          :is-loading="isLoadingPower"
        >
          delegate
        </MButton>
      </div>
    </form>

    <form
      class="my-4 bg-grey-800 p-6 font-inter"
      @submit.prevent="delegateZero"
    >
      <div>
        <div class="flex justify-between items-center my-3">
          <div>$ZERO tokens</div>
          <div class="flex gap-1 items-center">
            <MIconZero class="h-6 w-6" />
            <span
              :class="{
                'text-accent-mint': !canDelegate,
              }"
              class="mx-2 flex items-center text-2xl"
            >
              {{ balanceZeroToken?.data?.value?.formatted }}
            </span>
          </div>
        </div>
        <label class="text-grey-600">Delegation address</label>
        <input
          id="input-delegate-zero"
          v-model="inputZeroDelegates"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-4"
          data-test="delegate-zero-input-address"
        />

        <div v-if="hasDelegatedZero" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ zeroDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressZero"
        >
          Use my address
        </NuxtLink>
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="
            !isConnected || !canDelegate || !inputZeroDelegates || isLoadingZero
          "
          data-test="delegate-button-zero-submit"
          :is-loading="isLoadingZero"
        >
          delegate
        </MButton>
      </div>
    </form>

    <p class="px-6 text-grey-600 text-xxs lg:text-sm font-mono text-end mt-6">
      /* The delegated tokens will be available for voting starting from the
      next epoch. */
    </p>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useAccount } from "use-wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useMBalances, useMDelegates } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());

const inputPowerDelegates = ref();
const inputZeroDelegates = ref();

const { address: userAccount, isConnected } = useAccount();

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useMDelegates(userAccount);

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(userAccount);

function onUseMyAddress(refAddress: Ref<string | undefined>) {
  refAddress.value = userAccount.value!;
}
const onUseMyAddressPower = () => onUseMyAddress(inputPowerDelegates);
const onUseMyAddressZero = () => onUseMyAddress(inputZeroDelegates);

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);

const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();
const alerts = useAlertsStore();

const isLoadingPower = ref(false);
const isLoadingZero = ref(false);

useHead({
  titleTemplate: "%s - Delegate",
});

async function delegatePower() {
  await forceSwitchChain();

  isLoadingPower.value = true;

  try {
    const hash = await writePowerToken(wagmiConfig, {
      address: spog.contracts.value.powerToken as Hash,
      functionName: "delegate",
      args: [inputPowerDelegates.value! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });
    // Fail tx
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was not successful");
    }
    alerts.successAlert(
      "POWER tokens voting power were delegated Successfully!"
    );
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
  } finally {
    isLoadingPower.value = false;
  }
}

async function delegateZero() {
  await forceSwitchChain();

  isLoadingZero.value = true;

  try {
    const hash = await writeZeroToken(wagmiConfig, {
      address: spog.contracts.value.zeroToken as Hash,
      functionName: "delegate",
      args: [inputZeroDelegates.value! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });
    // Fail tx
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was not successful");
    }
    alerts.successAlert(
      "ZERO tokens voting power were delegated Successfully!"
    );
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
  } finally {
    isLoadingZero.value = false;
  }
}
</script>
