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
          <div class="text-xl">$POWER</div>
          <div class="flex-col gap-2">
            <div class="flex gap-1 items-center">
              <MIconPower class="h-6 w-6" />
              <span
                class="flex items-center text-2xl"
                :class="{
                  'text-accent-mint': !canDelegate,
                }"
              >
                {{ powerVotingPower?.data.value?.relative?.toFixed(2) }}%
              </span>
            </div>
            <div>
              <span class="text-xxs text-gray-600 uppercase">Voting Power</span>
            </div>
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
          @click="onUseMyAddressPower"
        >
          Use my address
        </NuxtLink>
        <MButton
          id="button-delegate-power"
          type="submit"
          data-test="delegate-button-power-submit"
          :disabled="
            !isConnected ||
            !canDelegate ||
            !powerFormData.address ||
            powerFormData.loading
          "
          :is-loading="powerFormData.loading"
        >
          delegate POWER
        </MButton>
      </div>
    </form>

    <form
      class="my-4 bg-grey-800 p-6 font-inter"
      @submit.prevent="delegateZero"
    >
      <div>
        <div class="flex justify-between items-center my-3">
          <div class="text-xl">$ZERO</div>
          <div class="flex-col gap-2">
            <div class="flex gap-1 items-center">
              <MIconZero class="h-6 w-6" />
              <span
                :class="{
                  'text-accent-mint': !canDelegate,
                }"
                class="mx-2 flex items-center text-2xl"
              >
                {{ zeroVotingPower?.data.value?.relative?.toFixed(2) }}%
              </span>
            </div>
            <div>
              <span class="text-xxs text-gray-600 uppercase">Voting Power</span>
            </div>
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
          @click="onUseMyAddressZero"
        >
          Use my address
        </NuxtLink>
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="
            !isConnected ||
            !canDelegate ||
            !zeroFormData.address ||
            zeroFormData.loading
          "
          data-test="delegate-button-zero-submit"
          :is-loading="zeroFormData.loading"
        >
          delegate ZERO
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
import { useMDelegates, useMVotingPower } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());
const alerts = useAlertsStore();

const { address: userAccount, isConnected } = useAccount();

const {
  powerDelegates,
  zeroDelegates,
  hasDelegatedPower,
  hasDelegatedZero,
  ...useDelegate
} = useMDelegates(userAccount);

const {
  power: powerVotingPower,
  zero: zeroVotingPower,
  ...useVotingPower
} = useMVotingPower(userAccount);

const onUseMyAddressPower = () => (powerFormData.address = userAccount.value!);
const onUseMyAddressZero = () => (zeroFormData.address = userAccount.value!);

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
    }

    alerts.successAlert(
      "POWER tokens voting power were delegated Successfully!"
    );

    useDelegate.refetch();
    useVotingPower.refetch();
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
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
    }

    alerts.successAlert(
      "ZERO tokens voting power were delegated Successfully!"
    );
    useDelegate.refetch();
    useVotingPower.refetch();
  } catch (error) {
    console.error(error);
    alerts.errorAlert("Error while delegating!");
  } finally {
    zeroFormData.loading = false;
  }
}
</script>
