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
        <MInput
          id="input-delegate-power"
          v-model="powerFormData.address"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-2"
          data-test="delegate-power-input-address"
          :errors="$delegatePowerValidation.address?.$errors"
        />

        <div v-if="hasDelegatedPower" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ powerDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressVote"
          >Use my address</NuxtLink
        >
        <MButton
          id="button-delegate-power"
          type="submit"
          :disabled="!isConnected || !canDelegate || !powerFormData.address"
          data-test="delegate-button-power-submit"
          :is-loading="powerFormData.loading"
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
        <MInput
          id="input-delegate-zero"
          v-model="zeroFormData.address"
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-2"
          data-test="delegate-zero-input-address"
          :errors="$delegateZeroValidation.address?.$errors"
        />

        <div v-if="hasDelegatedZero" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ zeroDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressValue"
          >Use my address</NuxtLink
        >
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="!isConnected || !canDelegate || !zeroFormData.address"
          data-test="delegate-button-zero-submit"
          :is-loading="zeroFormData.loading"
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
import { Hash, isAddress } from "viem";
import { useAccount } from "use-wagmi";
import { helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useMBalances } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());
const alerts = useAlertsStore();

const { address: userAccount, isConnected } = useAccount();

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(userAccount);

const onUseMyAddressVote = () => (powerFormData.address = userAccount.value!);
const onUseMyAddressValue = () => (zeroFormData.address = userAccount.value!);

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);

const addressValidation = (val: Hash) => isAddress(val);

const powerFormData = reactive({
  address: "",
  loading: false,
});

const zeroFormData = reactive({
  address: "",
  loading: false,
});

const addressRules = {
  address: {
    addressValidation: helpers.withMessage(
      "Invalid address",
      addressValidation
    ),
  },
};

const $delegatePowerValidation = useVuelidate(addressRules, powerFormData);
const $delegateZeroValidation = useVuelidate(addressRules, zeroFormData);

const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();

useHead({
  titleTemplate: "%s - Delegate",
});

async function delegatePower() {
  await $delegatePowerValidation.value.$validate();
  if ($delegatePowerValidation.value.$error) return;
  powerFormData.loading = true;

  try {
    await forceSwitchChain();

    const hash = await writePowerToken(wagmiConfig, {
      address: spog.contracts.value.powerToken as Hash,
      functionName: "delegate",
      args: [powerFormData.address! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    } else {
      alerts.successAlert(
        `Power successfully delegated to ${powerFormData.address}.`
      );
    }
  } finally {
    powerFormData.loading = false;
  }
}

async function delegateZero() {
  await $delegateZeroValidation.value.$validate();
  if ($delegateZeroValidation.value.$error) return;
  zeroFormData.loading = true;

  try {
    await forceSwitchChain();

    const hash = await writeZeroToken(wagmiConfig, {
      address: spog.contracts.value.zeroToken as Hash,
      functionName: "delegate",
      args: [zeroFormData.address! as Hash],
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    } else {
      alerts.successAlert(
        `Zero successfully delegated to ${powerFormData.address}.`
      );
    }
  } finally {
    zeroFormData.loading = false;
  }
}
</script>
